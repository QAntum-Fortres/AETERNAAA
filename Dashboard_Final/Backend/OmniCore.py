import asyncio
import json
import random
import requests
import os
import subprocess
import sys
from datetime import datetime
from abc import ABC, abstractmethod

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

# Force logs to show up immediately
def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")
    sys.stdout.flush()

log(">>> OMNI-CORE STARTING UP (FIXED ROUTES) <<<")

try:
    from Ledger import ImmutableLedger
    from NexusLogic import calculate_global_entropy_rust
    log("Internal modules loaded.")
except Exception as e:
    log(f"Module load error: {e}")

# ==========================================
# 0. PROJECT AUDITOR & MATRIX
# ==========================================

class ProjectAuditor:
    def __init__(self, root_path: str):
        self.root = root_path
        self.total_files = 0
        self.total_loc = 0
        self.last_run = 0
        self.cache_duration = 300 

    def audit(self):
        now = datetime.now().timestamp()
        if now - self.last_run < self.cache_duration and self.total_files > 0:
            return self.total_files, self.total_loc

        f_count = 0
        loc_count = 0
        ignore_dirs = {'.git', 'node_modules', 'dist', 'target', '.next', '__pycache__'}
        
        try:
            for root, dirs, files in os.walk(self.root):
                dirs[:] = [d for d in dirs if d not in ignore_dirs]
                f_count += len(files)
                for f in files:
                    if f.endswith(('.ts', '.tsx', '.rs', '.py', '.html', '.css', '.js', '.json')):
                        try:
                            with open(os.path.join(root, f), 'rb') as fp:
                                loc_count += sum(1 for line in fp)
                        except:
                            pass
        except:
            pass
        
        self.total_files = f_count
        self.total_loc = loc_count
        self.last_run = now
        return f_count, loc_count

class ProjectMatrix:
    def __init__(self):
        self.services = {
            "Helios Command": "https://framework-frontend-1000690699464.us-central1.run.app",
            "Logos Mind": "https://aeterna-logos-1000690699464.europe-west1.run.app",
            "Wealth Bridge": "https://framework-backend-1000690699464.us-central1.run.app/docs",
            "SEO Auditor": "https://framework-frontend-1000690699464.us-central1.run.app/seo-audit"
        }
        self.status_cache = {}
        self.last_check = 0

    def check_health(self):
        now = datetime.now().timestamp()
        if now - self.last_check < 60 and self.status_cache:
            return self.status_cache

        results = {}
        for name, url in self.services.items():
            try:
                resp = requests.head(url, timeout=1.0)
                results[name] = "online" if resp.status_code < 400 else "degraded"
            except:
                results[name] = "offline"
        
        self.status_cache = results
        self.last_check = now
        return results

# ==========================================
# 1. CORE GOVERNORS
# ==========================================

class OmniGovernor(ABC):
    def __init__(self, system_name: str):
        self.system_name = system_name
        self.current_stress = 0.0
        self.last_action = "IDLE"

    def normalize_stress(self, current_val: float, max_val: float) -> float:
        return min(max(current_val / max_val, 0.0), 1.0)

    @abstractmethod
    def read_sensor(self) -> float: pass
    @abstractmethod
    def execute_countermeasure(self, stress_level: float, override: bool = False): pass
    @abstractmethod
    def get_max_limit(self) -> float: pass

    def run_cycle(self):
        try:
            raw_value = self.read_sensor()
            self.current_stress = self.normalize_stress(raw_value, self.get_max_limit())
            self.last_action = "OPTIMAL"
        except Exception as e:
            self.current_stress = 0.0
            self.last_action = "ERROR"

class EnergyGridGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 1000.0
    def read_sensor(self) -> float:
        try:
            return float(requests.get("https://api.open-meteo.com/v1/forecast?latitude=42.69&longitude=23.32&current=shortwave_radiation", timeout=0.5).json()['current']['shortwave_radiation'])
        except:
            return 0.0
    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "AGGRESSIVE SELL" if override else "DIVERT TO BATTERY"

class MarketRiskGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 150000.0
    def read_sensor(self) -> float:
        try:
            return float(requests.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", timeout=0.5).json()['price'])
        except:
            return 95000.0
    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "EMERGENCY LIQUIDATION" if override else "HEDGING"

class BioHealthGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 180.0
    def read_sensor(self) -> float:
        base = 75
        spike = 90 if random.random() > 0.85 else 0
        return base + (random.random() * 15) + spike
    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "OPTIMIZING COMFORT" if override else "ADRENALINE BLOCK"

# ==========================================
# 2. FASTAPI APP
# ==========================================

app = FastAPI(title="AETERNA SOVEREIGN ENGINE", version="4.1")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Govs
bio = BioHealthGovernor("BIO")
mkt = MarketRiskGovernor("MKT")
nrg = EnergyGridGovernor("NRG")
auditor = ProjectAuditor(os.path.dirname(os.path.abspath(__file__)))
matrix = ProjectMatrix()
ledger = ImmutableLedger()

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        log(f"WebSocket client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            log(f"WebSocket client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except:
                self.disconnect(connection)

manager = ConnectionManager()

# Background Task for System Heartbeat
async def system_heartbeat():
    log("Heartbeat Task Started (1Hz).")
    while True:
        try:
            # Run Govs
            bio.run_cycle()
            mkt.run_cycle()
            nrg.run_cycle()

            # Orchestrator Logic
            orchestrator_msg = "SYSTEM SYNCED"
            if bio.current_stress > 0.6:
                mkt.execute_countermeasure(mkt.current_stress, override=True)
                orchestrator_msg = "⚠️ HOST STRESS! REDUCING FINANCIAL RISK"
            elif mkt.current_stress > 0.9:
                nrg.execute_countermeasure(nrg.current_stress, override=True)
                orchestrator_msg = "📉 MARKET CRASH! ACTIVATING ENERGY ARBITRAGE"
            
            # Ledger
            ledger.add_entry(bio.current_stress, mkt.current_stress, nrg.current_stress)

            # Fallback indices
            sovereign_index = 0.8890
            rust_stats = {"cpu_usage": 0.0, "ram_used_gb": 0.0, "entropy": 0.0}

            # Payload
            payload = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "entropy": rust_stats.get("entropy", sovereign_index),
                "orchestrator": orchestrator_msg,
                "bio": {"stress": bio.current_stress, "action": bio.last_action},
                "market": {"stress": mkt.current_stress, "action": mkt.last_action},
                "energy": {"stress": nrg.current_stress, "action": nrg.last_action},
                "project": {"files": auditor.audit()[0], "loc": auditor.audit()[1]},
                "projects": matrix.check_health(),
                "hardware": {
                    "cpu": rust_stats.get("cpu_usage", random.random() * 5),
                    "ram": rust_stats.get("ram_used_gb", 0.5 + random.random()),
                    "resonance": 0.8890
                }
            }
            
            await manager.broadcast(json.dumps(payload))
        except Exception as e:
            log(f"Heartbeat cycle error: {e}")
            
        await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    log("FastAPI Startup.")
    asyncio.create_task(system_heartbeat())

# WebSocket at / and /ws for compatibility
@app.websocket("/")
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text() # Keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        log(f"WS Exception: {e}")
        manager.disconnect(websocket)

# Health Check
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

# Serve Static Index explicitly at /
@app.get("/")
async def get_index():
    index_path = os.path.join(os.path.dirname(__file__), "public", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse("<h1>OmniCore v4.1</h1><p>Public folder is empty. Check deployment logs.</p>", status_code=404)

# Serve Static Files
log("Mounting static files from /public")
app.mount("/static", StaticFiles(directory="public"), name="static")

# Run directly
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
