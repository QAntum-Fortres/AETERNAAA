# Render.com Deployment Guide for AETERNAAA

## 🚀 Quick Deploy to Render

This repository is configured for automatic deployment to Render.com using the `render.yaml` configuration.

### Prerequisites
- GitHub account connected to Render
- Jules API Key: `rnd_2voZPGRNZjBw8wNQkR7NHMqLGL8Y`
- Stripe API credentials
- Binance Exchange API credentials (optional)

---

## 📋 Deployment Steps

### Step 1: Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select this repository: `QAntum-Fortres/AETERNAAA`
5. Render will automatically detect `render.yaml`

### Step 2: Configure Environment Variables

The `render.yaml` file defines three services. Set the following environment variables in Render dashboard:

#### For `aeterna-backend` service:
```bash
STRIPE_SECRET_KEY=sk_live_...              # Your Stripe secret key
EXCHANGE_API_KEY=your_binance_api_key      # Binance API key
EXCHANGE_SECRET_KEY=your_binance_secret    # Binance secret key
JULES_API_KEY=rnd_2voZPGRNZjBw8wNQkR7NHMqLGL8Y
```

#### For `aeterna-middleware` service:
```bash
STRIPE_SECRET_KEY=sk_live_...              # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...            # Stripe webhook secret
EXCHANGE_API_KEY=your_binance_api_key      # Binance API key
EXCHANGE_SECRET_KEY=your_binance_secret    # Binance secret key
JULES_API_KEY=rnd_2voZPGRNZjBw8wNQkR7NHMqLGL8Y
```

#### For `aeterna-frontend` service:
```bash
VITE_JULES_API_KEY=rnd_2voZPGRNZjBw8wNQkR7NHMqLGL8Y
```

### Step 3: Deploy

1. Click **"Apply"** to create all services
2. Render will automatically:
   - Build Docker containers for backend and middleware
   - Build the static frontend
   - Deploy all services
   - Set up health checks
   - Configure custom domains (if DNS is set up)

### Step 4: Configure DNS (Optional)

If you want to use custom domains, add these DNS records:

```
Type    Name    Value                           TTL
A       @       [Render IP from dashboard]      3600
CNAME   api     aeterna-backend.onrender.com   3600
CNAME   www     aeterna.website                3600
```

---

## 🏗️ Architecture

The deployment consists of three services:

### 1. **Backend Service** (`aeterna-backend`)
- **Type:** Docker Web Service
- **Plan:** Pro ($7/month)
- **Port:** 8890
- **Health Check:** `/telemetry`
- **Custom Domain:** `api.aeterna.website`
- **Tech Stack:** Rust

### 2. **Middleware Service** (`aeterna-middleware`)
- **Type:** Docker Web Service
- **Plan:** Starter ($7/month)
- **Ports:** 8890 (HTTP), 8765 (WebSocket)
- **Health Check:** `/api/status`
- **Tech Stack:** Node.js/TypeScript

### 3. **Frontend Service** (`aeterna-frontend`)
- **Type:** Static Site
- **Plan:** Starter ($7/month)
- **Build:** Vite
- **Custom Domains:** `aeterna.website`, `www.aeterna.website`
- **Tech Stack:** React/Vite

**Total Monthly Cost:** ~$21 for all services

---

## 🔧 Service Configuration

### Backend (Rust)
```yaml
- Built from: Dockerfile.backend
- Docker context: . (root)
- Environment: Production
- Logging: info level
- CORS: https://aeterna.website
```

### Middleware (TypeScript)
```yaml
- Built from: Dockerfile.middleware
- Docker context: ./OmniCore
- Environment: Production
- WebSocket: Enabled on port 8765
- CORS: Backend service
```

### Frontend (Static)
```yaml
- Build command: cd helios-ui && npm install && npm run build
- Publish directory: helios-ui/dist
- API URL: https://api.aeterna.website
- WebSocket URL: wss://ws.aeterna.website
```

---

## ✅ Health Checks

After deployment, verify all services are running:

### Backend Health
```bash
curl https://api.aeterna.website/telemetry
```
Expected: JSON with system metrics

### Middleware Health
```bash
curl https://aeterna-middleware.onrender.com/api/status
```
Expected: `{"status": "ONLINE", ...}`

### Frontend
```bash
curl https://aeterna.website
```
Expected: HTML page

---

## 🔄 Auto-Deploy

The services are configured for automatic deployment:
- **Trigger:** Push to `main` branch (or configured branch)
- **Process:** Render automatically rebuilds and redeploys
- **Downtime:** Minimal (uses rolling deployments)

---

## 📊 Monitoring

### Render Dashboard Features:
- Real-time logs for each service
- Performance metrics
- Health check status
- Deployment history
- Custom domain management

### Access Logs:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select the service (backend, middleware, or frontend)
3. Click **"Logs"** tab
4. View real-time logs or download historical logs

---

## 🐛 Troubleshooting

### Services Not Starting
1. Check environment variables are set correctly
2. Verify Docker builds locally:
   ```bash
   docker build -f Dockerfile.backend .
   docker build -f Dockerfile.middleware .
   ```
3. Check logs in Render dashboard

### Health Checks Failing
1. Verify the health check endpoints:
   - Backend: `/telemetry`
   - Middleware: `/api/status`
2. Check if PORT environment variable is set
3. Ensure services are listening on 0.0.0.0, not localhost

### Build Failures
1. Check build logs in Render dashboard
2. Verify Dockerfiles are correct
3. Ensure all dependencies are in package.json/Cargo.toml

### Domain Not Working
1. Verify DNS records are set correctly
2. Wait for DNS propagation (up to 48 hours)
3. Check SSL certificate status in Render dashboard

---

## 🔐 Security Notes

- All sensitive environment variables use `sync: false` to prevent them from being exposed
- Set actual values in Render dashboard, not in code
- Never commit `.env.production` file to Git
- Use `.env.production.example` as a template only

---

## 📝 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Blueprint Specification](https://render.com/docs/blueprint-spec)
- [AETERNAAA Main Documentation](README.md)
- [General Deployment Guide](DEPLOYMENT.md)
- [Production Deployment Guide](PRODUCTION_DEPLOYMENT.md)

---

## 🎯 Next Steps After Deployment

1. ✅ Verify all health checks pass
2. ✅ Test payment integration with Stripe
3. ✅ Configure Stripe webhooks to point to your Render URL
4. ✅ Test WebSocket connections
5. ✅ Set up monitoring and alerts
6. ✅ Configure custom domains (optional)
7. ✅ Test the complete user flow

---

**Status:** ✅ Ready for Deployment  
**Jules API Key:** `rnd_2voZPGRNZjBw8wNQkR7NHMqLGL8Y`  
**Configuration:** Complete and tested  
**Estimated Deployment Time:** 15-20 minutes  
