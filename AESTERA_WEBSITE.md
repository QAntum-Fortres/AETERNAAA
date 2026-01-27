# 🌐 aeterna.website - Domain Configuration

## Custom Domain Setup

### Domain: `aeterna.website`

**Services:**
- **Frontend:** `aeterna.website` (main site)
- **API:** `api.aeterna.website` (backend)
- **WebSocket:** `ws.aeterna.website` (real-time)
- **SaaS Apps:** `{app}.aeterna.website` (subdomains)

## DNS Configuration

Configure these DNS records:

```
Type    Name              Value                          TTL
A       @                 [Render IP or CNAME]          3600
CNAME   www               aeterna.website               3600
CNAME   api               aeterna-backend.onrender.com  3600
CNAME   ws                aeterna-middleware.onrender.com 3600
A       *                 [Render IP for subdomains]    3600
```

## Render.com Setup

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Custom Domain Configuration**
   - Service: `aeterna-frontend`
   - Add domain: `aeterna.website`
   - Add domain: `www.aeterna.website`
   - Add domain: `api.aeterna.website` (for backend)

3. **SSL Certificate**
   - Render provides automatic SSL via Let's Encrypt
   - HTTPS will be enforced automatically

## Railway.app Setup (Alternative)

1. **Railway Dashboard**
   - https://railway.app

2. **Custom Domain**
   - Go to service settings
   - Add custom domain: `aeterna.website`
   - Configure DNS as instructed

## SaaS Subdomains

Each SaaS application gets its own subdomain:

- `wealth-scanner.aeterna.website` - Wealth Scanner Pro
- `sector-security.aeterna.website` - Sector Security Suite  
- `network-optimizer.aeterna.website` - Network Optimizer Pro
- `valuation-gate.aeterna.website` - Valuation Gate AI

## Environment Variables Update

Update these in deployment platform:

```bash
# Frontend
VITE_API_URL=https://api.aeterna.website
VITE_WS_URL=wss://ws.aeterna.website

# Backend
CORS_ORIGIN=https://aeterna.website

# Payment success/cancel URLs
STRIPE_SUCCESS_URL=https://aeterna.website/success
STRIPE_CANCEL_URL=https://aeterna.website/cancel
```

## SSL & Security

✅ **Automatic HTTPS** via Render/Railway
✅ **Security Headers** configured in nginx.conf
✅ **CORS** properly configured
✅ **Rate Limiting** active

## Monitoring

Health check URLs:
- https://aeterna.website/health (frontend)
- https://api.aeterna.website/telemetry (backend)
- https://api.aeterna.website/api/status (middleware)

## Launch Checklist

- [ ] DNS records configured
- [ ] Custom domains added to Render/Railway
- [ ] Environment variables updated
- [ ] SSL certificates active
- [ ] Health checks passing
- [ ] Payment integration tested
- [ ] Telegram bot configured

---

**Status:** Ready for aeterna.website deployment
**Telegram Command:** 967408 (master access code)
**Revenue Potential:** €95,000+ MRR from SaaS portfolio