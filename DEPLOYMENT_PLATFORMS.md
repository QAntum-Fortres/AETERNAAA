# AETERNAAA Deployment Platforms Guide

## 🚀 Supported Platforms

AETERNAAA can be deployed on multiple platforms. Choose based on your needs:

### 1. Render.com

**Configuration:** `render.yaml`

**Services:**
- Backend (Rust) - Port 8890
- Middleware (Node.js) - Port 8890 (HTTP), 8765 (WebSocket)
- Frontend (Static) - React build

**Setup:**
1. Connect GitHub repo to Render
2. Render will auto-detect `render.yaml`
3. Set environment variables in Render dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `EXCHANGE_API_KEY`
   - `EXCHANGE_SECRET_KEY`
4. Deploy automatically on push

**URLs:**
- Backend: `https://aeterna-backend.onrender.com`
- Middleware: `https://aeterna-middleware.onrender.com`
- Frontend: `https://aeterna-frontend.onrender.com`

---

### 2. Railway.app

**Configuration:** `railway.toml` + `railway.json`

**Services:**
- Backend (Rust) - Auto-detected from Dockerfile
- Middleware (Node.js) - Separate service

**Setup:**
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Link project: `railway link`
5. Set environment variables:
   ```bash
   railway variables set STRIPE_SECRET_KEY=sk_live_...
   railway variables set STRIPE_WEBHOOK_SECRET=whsec_...
   railway variables set EXCHANGE_API_KEY=...
   railway variables set EXCHANGE_SECRET_KEY=...
   ```
6. Deploy: `railway up`

**Or via Dashboard:**
1. Connect GitHub repo
2. Railway auto-detects services from `railway.json`
3. Set environment variables in dashboard
4. Auto-deploys on push

---

### 3. Google Cloud Run

**Configuration:** `.github/workflows/docker-publish.yml`

**Setup:**
1. Enable Cloud Run API
2. Set up Google Artifact Registry
3. Configure GitHub Actions secrets:
   - `GOOGLE_CLOUD_PROJECT_ID`
   - `GOOGLE_CLOUD_SA_KEY`
4. Push to trigger deployment

**Deploy manually:**
```bash
gcloud run deploy aeterna-backend \
  --image gcr.io/PROJECT_ID/aeterna-backend \
  --platform managed \
  --region europe-west1 \
  --port 8890
```

---

### 4. Self-Hosted (Docker Compose)

**Configuration:** `docker-compose.yml`

**Setup:**
```bash
# Copy environment template
cp .env.production.example .env.production
# Edit .env.production with your keys

# Deploy
docker-compose up -d

# Or with production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Requirements:**
- VPS with Docker installed
- Minimum: 2 CPU, 4GB RAM
- Recommended: 4 CPU, 8GB RAM

---

## 🔧 Environment Variables

All platforms require these environment variables:

### Required
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
EXCHANGE_API_KEY=...
EXCHANGE_SECRET_KEY=...
```

### Optional
```bash
PORT=8890
WS_PORT=8765
RUST_LOG=info
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

---

## 📊 Platform Comparison

| Feature | Render | Railway | Cloud Run | Self-Hosted |
|---------|--------|---------|-----------|-------------|
| **Free Tier** | ✅ Limited | ✅ $5 credit | ❌ | ✅ |
| **Auto-Deploy** | ✅ | ✅ | ✅ (CI/CD) | Manual |
| **WebSocket** | ✅ | ✅ | ✅ | ✅ |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ |
| **SSL** | ✅ Auto | ✅ Auto | ✅ Auto | Manual |
| **Scaling** | Auto | Auto | Auto | Manual |
| **Cost** | $7+/mo | Pay-as-you-go | Pay-as-you-go | VPS cost |

---

## 🚀 Quick Deploy Commands

### Render
```bash
# Auto-deploys on git push
git push origin main
```

### Railway
```bash
railway login
railway init
railway up
```

### Cloud Run
```bash
# Via GitHub Actions (automatic)
# Or manually:
gcloud run deploy aeterna-backend --source .
```

### Docker Compose
```bash
./scripts/deploy.sh
```

---

## 🔗 Platform URLs

After deployment, update these in your frontend:
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket URL (wss:// for HTTPS)

---

## 📝 Notes

- **Render**: Free tier has sleep after inactivity. Upgrade for 24/7 uptime.
- **Railway**: Uses $5 free credit monthly. Very developer-friendly.
- **Cloud Run**: Serverless, scales to zero. Pay per request.
- **Self-Hosted**: Full control, but requires maintenance.

---

**Recommended for Production:** Railway or Self-Hosted VPS
**Recommended for Development:** Render (free tier) or Railway
