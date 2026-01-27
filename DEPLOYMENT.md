# AETERNAAA Enterprise Production Deployment Guide

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Stripe account with API keys
- Binance account with API keys (read-only recommended)
- Domain name (for SSL/HTTPS)
- VPS or Cloud server (Ubuntu 20.04+ recommended)

### Step 1: Clone and Setup

```bash
git clone https://github.com/QAntum-Fortres/AETERNAAA.git
cd AETERNAAA
```

### Step 2: Configure Environment Variables

```bash
cp .env.production.example .env.production
nano .env.production  # Edit with your actual values
```

**Required variables:**
- `STRIPE_SECRET_KEY` - Your Stripe live secret key (`sk_live_...`)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (`whsec_...`)
- `EXCHANGE_API_KEY` - Binance API key
- `EXCHANGE_SECRET_KEY` - Binance secret key

### Step 3: Build and Deploy

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run deployment script
./scripts/deploy.sh
```

Or manually:

```bash
docker-compose build
docker-compose up -d
```

### Step 4: Verify Deployment

```bash
# Check health
./scripts/healthcheck.sh

# View logs
docker-compose logs -f

# Check individual services
curl http://localhost:8890/telemetry  # Backend
curl http://localhost:8890/api/status  # Middleware
curl http://localhost:80                # Frontend
```

## 📋 Architecture

```
┌─────────────────────────────────────────┐
│         Nginx Reverse Proxy             │
│      (SSL, Rate Limiting, Routing)      │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼───┐  ┌───▼────┐
│Frontend│  │Backend│  │Middleware│
│ (Nginx)│  │(Rust) │  │(Node.js) │
│  :80   │  │ :8890 │  │ :8890   │
│        │  │       │  │ :8765   │
└────────┘  └───────┘  └─────────┘
```

## 🔧 Configuration

### Stripe Webhook Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Binance API Setup

1. Go to [Binance API Management](https://www.binance.com/en/my/settings/api-management)
2. Create API key with **READ-ONLY** permissions (no trading)
3. Copy API key and secret to `.env.production`

### SSL/HTTPS Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured in certbot)
sudo certbot renew --dry-run
```

Update `nginx.conf` with your certificate paths:
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

## 🐳 Docker Services

### Backend (Rust)
- **Port**: 8890
- **Health**: `GET /telemetry`
- **Logs**: `docker-compose logs -f backend`

### Middleware (Node.js)
- **Ports**: 8890 (HTTP), 8765 (WebSocket)
- **Health**: `GET /api/status`
- **Logs**: `docker-compose logs -f middleware`

### Frontend (Nginx)
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Health**: `GET /health`
- **Logs**: `docker-compose logs -f frontend`

### Nginx Reverse Proxy
- **Ports**: 8080 (HTTP), 8443 (HTTPS)
- **Logs**: `docker-compose logs -f nginx`

## 🔒 Security Best Practices

✅ **Implemented:**
- HTTPS/SSL enforced
- Rate limiting on API endpoints
- CORS configuration
- Non-root Docker containers
- Security headers (X-Frame-Options, CSP, etc.)
- Webhook signature verification

⚠️ **Additional Recommendations:**
- Use firewall (UFW) to restrict ports
- Regular security updates: `docker-compose pull && docker-compose up -d`
- Monitor logs for suspicious activity
- Use strong passwords for API keys
- Enable 2FA on Stripe and Binance accounts

## 📊 Monitoring

### Health Checks

```bash
# Manual health check
./scripts/healthcheck.sh

# Continuous monitoring
watch -n 30 ./scripts/healthcheck.sh
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f middleware

# Last 100 lines
docker-compose logs --tail=100
```

### Metrics

- Backend telemetry: `GET /telemetry`
- Middleware status: `GET /api/status`
- Payment stats: `GET /api/economy/stats`

## 🔄 Updates and Maintenance

### Update Application

```bash
git pull origin main
docker-compose build
docker-compose up -d
```

### Backup Data

```bash
# Backup ledger and data
docker-compose exec backend tar czf /data/backup-$(date +%Y%m%d).tar.gz /app/SOVEREIGN.ledger /app/data
```

### Rollback

```bash
# Stop services
docker-compose down

# Restore previous version
git checkout <previous-commit>
docker-compose build
docker-compose up -d
```

## 🚨 Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check environment variables
docker-compose config

# Restart services
docker-compose restart
```

### Payment webhooks not working

1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check webhook URL in Stripe dashboard
3. Verify nginx is forwarding raw body (see `nginx.conf`)
4. Check middleware logs: `docker-compose logs middleware | grep webhook`

### High memory usage

```bash
# Check resource usage
docker stats

# Restart services
docker-compose restart

# Scale down if needed (edit docker-compose.yml)
```

### Port conflicts

```bash
# Check what's using ports
sudo lsof -i :8890
sudo lsof -i :8765

# Change ports in docker-compose.yml if needed
```

## 🌐 Cloud Deployment Options

### Google Cloud Run

Already configured! See `.github/workflows/docker-publish.yml`

```bash
gcloud run deploy aeterna-backend \
  --image gcr.io/PROJECT_ID/aeterna-backend \
  --platform managed \
  --region europe-west1
```

### Railway

Already configured! See `railway.toml`

1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Render

Already configured! See `render.yaml`

1. Connect GitHub repo to Render
2. Set environment variables
3. Deploy automatically

### Self-Hosted VPS

Follow the Quick Start guide above. Recommended:
- **Minimum**: 2 CPU, 4GB RAM, 20GB SSD
- **Recommended**: 4 CPU, 8GB RAM, 50GB SSD
- **OS**: Ubuntu 20.04+ or Debian 11+

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review this guide
- Check GitHub Issues: https://github.com/QAntum-Fortres/AETERNAAA/issues

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Stripe webhook endpoint configured
- [ ] Binance API keys set (read-only)
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Firewall rules set
- [ ] Health checks passing
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation reviewed

---

**Status**: ✅ Production Ready
**Last Updated**: 2026-01-27
