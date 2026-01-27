# AETERNAAA ↔ QANTUM-JULES Sync Guide

## 🔄 Synchronization

AETERNAAA is synchronized with the QANTUM-JULES framework to share:
- Payment gateway improvements
- LwaS soul files
- OmniCore modules
- Nerve-center components
- Ledger data

## 📍 QANTUM-JULES Location

Default path: `C:\Users\papic\Downloads\RUST-AEGIS\QANTUM-JULES`

You can override with environment variable:
```bash
$env:QANTUM_JULES_PATH = "C:\path\to\QANTUM-JULES"
```

## 🚀 Sync Commands

### PowerShell (Windows)
```powershell
cd AETERNAAA
.\scripts\sync-with-qantum-jules.ps1
```

### Bash (Linux/Mac)
```bash
cd AETERNAAA
chmod +x scripts/sync-with-qantum-jules.sh
./scripts/sync-with-qantum-jules.sh
```

## 📦 What Gets Synced

1. **Payment Gateway** (`OmniCore/economy/PaymentGateway.ts`)
   - Latest payment processing improvements
   - Stripe integration updates

2. **LwaS Soul Files** (`LwaS/`)
   - Manifest axioms
   - Sovereign configurations

3. **OmniCore Modules** (`OmniCore/src/`)
   - Additional modules from QANTUM-JULES
   - Enhanced functionality

4. **Nerve Center** (`nerve-center/`)
   - Server components
   - Agent engines
   - Module integrations

5. **Ledger** (`SOVEREIGN.ledger`)
   - Transaction history
   - State data

## ⚠️ Important Notes

- Sync is **one-way**: QANTUM-JULES → AETERNAAA
- Always review changes before committing
- Backup before syncing in production
- Some paths may differ between projects

## 🔗 Integration Points

After syncing, verify these connections:

1. **Payment Methods**: Check `OmniCore/economy/PaymentGateway.ts`
2. **API Endpoints**: Verify `OmniCore/SingularityServer.ts` routes
3. **Product Catalog**: Ensure `OmniCore/economy/Products.ts` is up to date
4. **Deployment Configs**: Update `render.yaml` and `railway.toml` if needed

## 🚀 Deployment After Sync

After syncing, deploy to platforms:

```bash
# Render
git push origin main  # Auto-deploys

# Railway
railway up

# Docker Compose
docker-compose up -d --build
```

---

**Last Sync:** Run sync script to update
**Next Sync:** When QANTUM-JULES has payment/feature updates
