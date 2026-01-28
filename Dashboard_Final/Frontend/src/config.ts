export const CONFIG = {
    // Cloud Run API Endpoint (REST)
    API_URL: "https://aeterna-core-python-1000690699464.us-central1.run.app",

    // WebSocket Endpoint - Local or Cloud
    // Set WS_MODE to "local" to use local Rust backend, or "cloud" to use cloud deployment
    WS_MODE: (import.meta.env.VITE_WS_MODE || "local") as "local" | "cloud",
    WS_LOCAL_URL: "ws://localhost:8080/ws",
    WS_CLOUD_URL: "wss://aeterna-core-python-1000690699464.us-central1.run.app",

    // System Parameters
    HEARTBEAT_INTERVAL: 10000,
    RECONNECT_INTERVAL: 5000,

    // Computed WebSocket URL based on mode
    get WS_URL() {
        return this.WS_MODE === "local" ? this.WS_LOCAL_URL : this.WS_CLOUD_URL;
    }
};
