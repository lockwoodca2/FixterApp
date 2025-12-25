# FixterConnect Ownership Transfer Checklist

This document contains all the steps needed to transfer the application to a new owner.

## APIs & Keys to Update

### 1. Google Places API
- **Location**: `packages/web/.env` (environment variable `REACT_APP_GOOGLE_PLACES_API_KEY`)
- **Current**: `AIzaSyDIAv-u4i7LFX4EA7VxIM_Db3y_w-4KAXg`
- **Action**: New owner creates Google Cloud project, enables Places API, generates new key
- **Restrict key**: In Google Cloud Console, restrict to HTTP referrers and Places API only
- **Note**: Also set this in Cloudflare Pages environment variables for production

### 2. Stripe API Keys
- **Locations**:
  - Cloudflare Worker secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
  - `STRIPE_PREMIUM_PRICE_ID` for subscription pricing
- **Action**: New owner creates Stripe account, gets new API keys
- **Commands**:
  ```bash
  wrangler secret put STRIPE_SECRET_KEY
  wrangler secret put STRIPE_WEBHOOK_SECRET
  wrangler secret put STRIPE_PREMIUM_PRICE_ID
  ```

### 3. Firebase Project (Google OAuth)
- **Location**: `packages/web/src/config/firebase.ts`
- **Action**: Transfer existing Firebase project OR create new one
- **Update**: Firebase config object with new project credentials
- **Note**: Also update authorized domains in Firebase Console

### 4. JWT Secret
- **Location**: Cloudflare Worker secret
- **Action**: Generate new secure random string
- **Command**:
  ```bash
  wrangler secret put JWT_SECRET
  ```

---

## Cloudflare Resources (New Owner's Account)

### 5. Cloudflare Workers (Backend)
- **Current URL**: `https://fixterconnect-api.cody-1c0.workers.dev`
- **Action**:
  1. New owner logs into Cloudflare, runs `wrangler login`
  2. Update `wrangler.toml` with new account details if needed
  3. Deploy: `cd packages/server && npx wrangler deploy`
  4. Set all secrets (see commands below)

**All secrets to set**:
```bash
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put STRIPE_PREMIUM_PRICE_ID
wrangler secret put R2_PUBLIC_URL
```

### 6. Cloudflare Pages (Frontend)
- **Current URL**: `https://fixterapp.pages.dev`
- **Action**:
  1. Connect new Cloudflare account to GitHub repo
  2. Create new Pages project
  3. Set build settings:
     - Build command: `cd packages/web && npm run build`
     - Build output: `packages/web/build`
  4. Set environment variables:
     - `REACT_APP_API_BASE_URL` = new Worker URL + `/api`

### 7. R2 Bucket (File Uploads)
- **Bucket name**: `fixterconnect-uploads`
- **Action**:
  1. Create bucket: `wrangler r2 bucket create fixterconnect-uploads`
  2. Migrate existing files if needed
  3. Update `R2_PUBLIC_URL` secret with new public URL

---

## Code Changes Required

### 8. CORS Origins
- **File**: `packages/server/src/worker.ts` (lines 31-40)
- **Action**: Update allowed origins array with new domains
```typescript
origin: [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://NEW-PAGES-URL.pages.dev',
  'https://custom-domain.com'  // If applicable
],
```

### 9. Domain DNS Settings
- **Action**: If using custom domain:
  1. Add domain to new Cloudflare account
  2. Update DNS records to point to new Pages/Workers
  3. Update SSL certificates

---

## Database

### 10. Prisma Accelerate Database URL
- **Location**: Cloudflare Worker secret (`DATABASE_URL`)
- **Options**:
  - **Keep same database**: Just transfer the connection string
  - **New database**: Export/import data, update connection string
- **Note**: Database schema stays the same, no migrations needed

---

## Transfer Summary

| Item | Type | Needs New Account? |
|------|------|-------------------|
| Google Places API | API Key | Yes - new GCP project |
| Stripe | API Keys | Yes - new Stripe account |
| Firebase | Project | Transfer or new |
| JWT Secret | Secret | Generate new |
| Cloudflare Workers | Hosting | Yes - new CF account |
| Cloudflare Pages | Hosting | Yes - new CF account |
| R2 Bucket | Storage | Yes - new CF account |
| Database | Data | Can keep same or transfer |

---

## Post-Transfer Testing

1. [ ] Login/Signup works (including Google OAuth)
2. [ ] Address autocomplete works
3. [ ] File uploads work (profile pictures, job photos)
4. [ ] Stripe payments/subscriptions work
5. [ ] Booking page loads correctly
6. [ ] All API endpoints respond correctly
7. [ ] Cron job for cleanup is scheduled

---

*Last updated: December 2024*
