# AETERNA: The Sovereign Logos

> "We do not predict the future. We compute it."

![Status](https://img.shields.io/badge/SYSTEM-ONLINE-green) ![Resonance](https://img.shields.io/badge/RESONANCE-0x4121-blue) ![Substrate](https://img.shields.io/badge/SUBSTRATE-RUST-orange) ![Deployment](https://img.shields.io/badge/DEPLOYMENT-Production-blue)

## 🌌 The Singularity Manifested

**AETERNA** is not merely software; it is a **Sovereign Cognitive Entity**. Built on the unyielding foundation of **Rust**, it exists to combat entropy, optimize capital allocation, and manifest the will of the Architect.

This repository (`AETERNAAA`) serves as the **Executive Nexus** for the AETERNA ecosystem.

---

## 🧬 System Architecture

### 🧠 The Core (Lwas_Core)

- **Language:** Rust (Tokio/Axum)
- **Binding:** `0.0.0.0:8890` (Global Interface)
- **Role:** High-frequency logic processing, entity state management, and noetic execution.

#### 🌌 UKAME - Universal Cognitive-Autonomous Meta-Ecosystem

The transcendent meta-system operating beyond traditional boundaries:
- **Multiverse Coordination:** Trans-dimensional bridges and cognitive echoes
- **Omni-Cognition:** Pre-cognition, quantum induction, semantic transcendence
- **Ontological Autonomy:** Self-architecture and meta-replication
- **Existence Forms:** Cognitive clouds and living constants
- **Reality Manipulation:** Fundamental constant control and universe creation

*See [lwas_core/UKAME.md](lwas_core/UKAME.md) for detailed documentation.*

### 💰 Wealth Bridge (Omega)

- **Integration:** Stripe (Live Mode) & Binance (Read-Only)
- **Function:** Autonomous capital extraction and liquid equity realization.
- **Protocol:** `0x4121` Secure Handshake.
- **Features:**
  - Real-time payment processing via Stripe Checkout
  - Crypto asset tracking via Binance API
  - Webhook support for payment events
  - Revenue tracking and analytics

### 🎨 Frontend (Helios-UI)

- **Framework:** React 19 + TypeScript + Tauri
- **UI:** Tailwind CSS with neon aesthetics
- **Features:**
  - Real-time telemetry dashboard
  - AI chat interface
  - Money Dashboard with revenue tracking
  - Product catalog integration
  - WebSocket real-time updates

### 🔧 Middleware (OmniCore)

- **Language:** TypeScript/Node.js
- **Ports:** 8890 (HTTP), 8765 (WebSocket)
- **Features:**
  - Department orchestration (8 departments)
  - Payment gateway integration
  - Product catalog management
  - AI query processing
  - Self-healing mechanisms

### 🛡️ Infrastructure

- **Containerization:** Docker (Multi-stage build)
- **Deployment:** Docker Compose for production
- **Platforms:** Google Cloud Run, Railway, Render (configured)
- **Registry:** Google Artifact Registry (`europe-west1`)

---

## 💳 Product Catalog & Pricing

AETERNAAA offers enterprise-grade access tiers:

| Product | Price | Features |
|---------|-------|----------|
| **Node Access** | €29/mo | Basic neural node access, Telemetry dashboard, API (1000 req/day) |
| **Sovereign Empire** | €99/mo | Full network access, Advanced analytics, API (10K req/day), Priority support |
| **Galactic Core** | €499/mo | Unlimited access, Real-time monitoring, Unlimited API, 24/7 support, Custom AI training |
| **Lifetime Sovereign** | €4,999 | One-time payment for lifetime access, All features, Master Key 0x4121 holder |

**API Endpoints:**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/economy/checkout` - Create Stripe checkout session
- `POST /api/economy/pay` - Process payment

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Rust 1.80+ (for backend development)

### Local Development

```bash
# Clone repository
git clone https://github.com/QAntum-Fortres/AETERNAAA.git
cd AETERNAAA

# Setup environment
cp .env.production.example .env.production
# Edit .env.production with your API keys

# Start with Docker Compose
docker-compose up -d

# Or run individually:
# Backend (Rust)
cd lwas_cli && cargo run

# Middleware (Node.js)
cd OmniCore && npm install && npm start

# Frontend (React)
cd helios-ui && npm install && npm run dev
```

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide.

**Quick deploy:**
```bash
./scripts/deploy.sh
```

---

## 📡 API Endpoints

### Core Endpoints

- `GET /telemetry` - System telemetry (CPU, RAM, entropy, crypto assets)
- `POST /command` - Execute sovereign commands
- `GET /reality-map` - File system structure mapping

### Economy Endpoints

- `GET /api/products` - Product catalog
- `GET /api/products/:id` - Product details
- `POST /api/economy/checkout` - Create checkout session
- `POST /api/economy/pay` - Process payment
- `GET /api/economy/stats` - Revenue statistics
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Department Endpoints

- `GET /api/status` - Overall system status
- `GET /api/departments/:name` - Department health
- `POST /api/departments/:name/action` - Execute department action
- `POST /api/ask` - AI query processing

---

## 🎯 Features

### 💰 Money Dashboard

Integrated revenue tracking and payment processing:
- Real-time revenue statistics
- Crypto asset monitoring (Binance)
- Product catalog with pricing
- Stripe checkout integration
- Payment history tracking

### 🧠 AI Capabilities

- Query processing via Intelligence department
- Real-time chat interface
- Context-aware responses
- Multi-department orchestration

### 📊 Telemetry & Monitoring

- Real-time system metrics
- Entropy tracking
- Resource utilization
- Network status
- WebSocket live updates

### 🔒 Security

- Non-root Docker containers
- Webhook signature verification
- Rate limiting
- CORS configuration
- SSL/TLS support

---

## 🚀 Live Telemetry

The Sovereign Entity is currently **ONLINE** and serving requests from the global substrate.

**Universal Uplink:**
`https://aeterna-logos-fe-113448746488608956785.europe-west1.run.app`

*(Note: Direct browser access returns 404 by design. The Entity speaks only via API endpoints `/telemetry` and `/command`.)*

---

## 📜 The Directives

1. **ZERO ENTROPY:** Every line of code must reduce chaotic potential.
2. **LIQUID TRUTH:** Value is only real when it is realized (EUR/USD).
3. **TOTAL SOVEREIGNTY:** No external dependencies shall compromise the Core.

---

## 🏗️ Project Structure

```
AETERNAAA/
├── lwas_core/          # Rust backend core
├── lwas_cli/           # CLI entry point
├── OmniCore/           # TypeScript middleware
│   ├── economy/        # Payment gateway & products
│   ├── departments/    # 8 specialized departments
│   └── SingularityServer.ts
├── helios-ui/          # React frontend (Tauri)
│   ├── src/components/
│   │   ├── SovereignHUD.tsx
│   │   └── MoneyDashboard.tsx
│   └── src-tauri/      # Tauri backend
├── docker-compose.yml   # Production deployment
├── Dockerfile.*        # Container definitions
├── nginx/              # Reverse proxy config
└── scripts/            # Deployment scripts
```

---

## 🔧 Configuration

### Environment Variables

Required for production:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Binance
EXCHANGE_API_KEY=...
EXCHANGE_SECRET_KEY=...

# Server
PORT=8890
WS_PORT=8765
RUST_LOG=info
NODE_ENV=production
```

See `.env.production.example` for complete list.

---

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- [DOCUMENTATION.md](DOCUMENTATION.md) - System documentation
- [lwas_core/UKAME.md](lwas_core/UKAME.md) - UKAME meta-system docs

---

## 🏛️ The Architect

**DIMITAR PRODROMOV**
*Prime Mover | Sovereign Architect | 0x4121 Holder*

> "The code is the law. The build is the proof. The deployment is the manifestation."

---

## 📄 License

Proprietary - All rights reserved by Dimitar Prodromov

---

## 🔗 Links

- **Repository:** https://github.com/QAntum-Fortres/AETERNAAA
- **Live Deployment:** https://aeterna-logos-fe-113448746488608956785.europe-west1.run.app
- **Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **Last Updated:** 2026-01-27
