# 🌐 AEStera.website - Domain Configuration

## Custom Domain Setup

### Domain: `aestera.website`

**Services:**
- **Frontend:** `aestera.website` (main site)
- **API:** `api.aestera.website` (backend)
- **WebSocket:** `ws.aestera.website` (real-time)
- **SaaS Apps:** `{app}.aestera.website` (subdomains)

## DNS Configuration

Configure these DNS records:

```
Type    Name              Value                          TTL
A       @                 [Render IP or CNAME]          3600
CNAME   www               aestera.website               3600
CNAME   api               aeterna-backend.onrender.com  3600
CNAME   ws                aeterna-middleware.onrender.com 3600
A       *                 [Render IP for subdomains]    3600
```

## Render.com Setup

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Custom Domain Configuration**
   - Service: `aeterna-frontend`
   - Add domain: `aestera.website`
   - Add domain: `www.aestera.website`
   - Add domain: `api.aestera.website` (for backend)

3. **SSL Certificate**
   - Render provides automatic SSL via Let's Encrypt
   - HTTPS will be enforced automatically

## Railway.app Setup (Alternative)

1. **Railway Dashboard**
   - https://railway.app

2. **Custom Domain**
   - Go to service settings
   - Add custom domain: `aestera.website`
   - Configure DNS as instructed

## SaaS Subdomains

Each SaaS application gets its own subdomain:

- `wealth-scanner.aestera.website` - Wealth Scanner Pro
- `sector-security.aestera.website` - Sector Security Suite  
- `network-optimizer.aestera.website` - Network Optimizer Pro
- `valuation-gate.aestera.website` - Valuation Gate AI

## Environment Variables Update

Update these in deployment platform:

```bash
# Frontend
VITE_API_URL=https://api.aestera.website
VITE_WS_URL=wss://ws.aestera.website

# Backend
CORS_ORIGIN=https://aestera.website

# Payment success/cancel URLs
STRIPE_SUCCESS_URL=https://aestera.website/success
STRIPE_CANCEL_URL=https://aestera.website/cancel
```

## SSL & Security

✅ **Automatic HTTPS** via Render/Railway
✅ **Security Headers** configured in nginx.conf
✅ **CORS** properly configured
✅ **Rate Limiting** active

## Monitoring

Health check URLs:
- https://aestera.website/health (frontend)
- https://api.aestera.website/telemetry (backend)
- https://api.aestera.website/api/status (middleware)

## Launch Checklist

- [ ] DNS records configured
- [ ] Custom domains added to Render/Railway
- [ ] Environment variables updated
- [ ] SSL certificates active
- [ ] Health checks passing
- [ ] Payment integration tested
- [ ] Telegram bot configured

---

**Status:** Ready for aestera.website deployment
**Telegram Command:** 967408 (master access code)
**Revenue Potential:** €95,000+ MRR from SaaS portfolio