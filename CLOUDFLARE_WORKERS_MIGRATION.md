# Cloudflare Workers Migration Plan

This document outlines the complete migration from Express.js to Cloudflare Workers using Hono framework.

## Overview

**Current Stack:**
- Express.js + Node.js
- Prisma ORM with direct database connection
- Local file uploads
- Traditional server deployment

**Target Stack:**
- Hono (lightweight web framework for Workers)
- Prisma with Accelerate/Data Proxy (for Workers compatibility)
- Cloudflare R2 (for file storage)
- Cloudflare Workers (serverless edge compute)

## Phase 1: Setup & Infrastructure

### 1.1 Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 1.2 Set Up Prisma Accelerate
Prisma direct connection doesn't work in Workers. Two options:

**Option A: Prisma Accelerate (Recommended)**
- Sign up at https://www.prisma.io/data-platform
- Create connection pool for your Supabase database
- Get Accelerate connection string
- Update schema.prisma datasource

**Option B: Prisma Data Proxy**
- Set up Prisma Data Proxy
- Configure proxy connection

### 1.3 Create Cloudflare R2 Bucket
```bash
wrangler r2 bucket create fixter-uploads
```

## Phase 2: Dependencies Update

### 2.1 Install Hono & Workers Dependencies
```bash
cd fixterconnect/packages/server
npm install hono
npm install @prisma/extension-accelerate
npm install @cloudflare/workers-types --save-dev
npm uninstall express @types/express cors @types/cors
```

### 2.2 Update package.json Scripts
```json
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "build": "tsc"
  }
}
```

## Phase 3: Core Migration

### 3.1 Create wrangler.toml
```toml
name = "fixterconnect-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
NODE_ENV = "production"

# Bindings will be added here
[[r2_buckets]]
binding = "UPLOADS_BUCKET"
bucket_name = "fixter-uploads"

# Secrets (set via wrangler secret put)
# DATABASE_URL (Prisma Accelerate URL)
# JWT_SECRET
# STRIPE_SECRET_KEY
```

### 3.2 Rewrite Main Entry Point (index.ts)

**Before (Express):**
```typescript
import express from 'express';
const app = express();
app.use(cors());
app.use(express.json());
```

**After (Hono):**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors({
  origin: ['https://your-app.pages.dev'],
  credentials: true
}));
```

### 3.3 Update Prisma Client Initialization

**Before:**
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

**After:**
```typescript
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate());
```

## Phase 4: Route Migration Pattern

### Express vs Hono Comparison

**Express Route:**
```typescript
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // ... logic
  res.json({ success: true, data: user });
});
```

**Hono Route:**
```typescript
app.post('/api/login', async (c) => {
  const { email, password } = await c.req.json();
  // ... logic
  return c.json({ success: true, data: user });
});
```

### Key Differences:
- `req, res` → `c` (Context)
- `req.body` → `await c.req.json()`
- `req.params.id` → `c.req.param('id')`
- `req.query.search` → `c.req.query('search')`
- `res.json()` → `return c.json()`
- `res.status(404)` → `return c.json({}, 404)`

## Phase 5: Middleware Migration

### 5.1 CORS Middleware
```typescript
import { cors } from 'hono/cors';

app.use('/*', cors({
  origin: ['https://1079739b.fixterapp.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
```

### 5.2 JWT Authentication Middleware
```typescript
import { jwt } from 'hono/jwt';

// Protect routes
app.use('/api/bookings/*', jwt({ secret: env.JWT_SECRET }));
app.use('/api/admin/*', jwt({ secret: env.JWT_SECRET }));
```

### 5.3 Error Handling
```typescript
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    success: false,
    error: err.message || 'Internal server error'
  }, 500);
});
```

## Phase 6: File Upload Migration

### 6.1 Multer → R2 Direct Upload

**Before (Multer):**
```typescript
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  // ...
});
```

**After (R2):**
```typescript
app.post('/api/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  // Upload to R2
  await c.env.UPLOADS_BUCKET.put(file.name, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return c.json({ success: true, url: `/uploads/${file.name}` });
});
```

## Phase 7: Route-by-Route Migration Checklist

- [ ] **Auth Routes** (`/api/login`, `/api/register`, `/api/logout`)
  - Convert Express handlers to Hono
  - Update bcrypt usage (ensure Workers compatibility)
  - Migrate JWT signing/verification

- [ ] **Services Routes** (`/api/services`)
  - Convert CRUD operations
  - Update Prisma queries for Accelerate

- [ ] **Bookings Routes** (`/api/bookings`)
  - Convert all booking endpoints
  - Ensure date handling works in Workers

- [ ] **Profiles Routes** (`/api/profiles`)
  - Migrate profile management
  - Update file upload logic for avatars

- [ ] **Messages Routes** (`/api/messages`)
  - Convert messaging endpoints
  - Update flag/moderation logic

- [ ] **Favorites Routes** (`/api/favorites`)
  - Simple CRUD migration

- [ ] **Invoices Routes** (`/api/invoices`)
  - Migrate invoice generation
  - Ensure Stripe integration works

- [ ] **Admin Routes** (`/api/admin`)
  - Migrate all admin endpoints
  - Update activity logging

- [ ] **Availability Routes** (`/api/availability`)
  - Convert availability management

- [ ] **Upload Routes** (`/api/upload`)
  - Complete R2 migration
  - Update image processing (Sharp → Workers-compatible alternative)

## Phase 8: TypeScript Configuration

### 8.1 Update tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ES2022",
    "lib": ["ES2021"],
    "moduleResolution": "node",
    "types": ["@cloudflare/workers-types"]
  }
}
```

## Phase 9: Environment Variables

### 9.1 Set Secrets via Wrangler
```bash
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put STRIPE_SECRET_KEY
# Add other secrets as needed
```

### 9.2 Set Non-Secret Variables in wrangler.toml
```toml
[vars]
NODE_ENV = "production"
PORT = "8787"
```

## Phase 10: Testing

### 10.1 Local Testing
```bash
wrangler dev
# Test with: http://localhost:8787
```

### 10.2 Test Each Endpoint
- [ ] POST /api/register
- [ ] POST /api/login
- [ ] GET /api/services
- [ ] POST /api/bookings
- [ ] GET /api/profiles/:id
- [ ] POST /api/messages
- [ ] GET /api/admin/users
- [ ] (Add all other endpoints)

## Phase 11: Deployment

### 11.1 Deploy to Workers
```bash
wrangler deploy
```

### 11.2 Get Workers URL
After deployment, you'll receive a URL like:
```
https://fixterconnect-api.your-subdomain.workers.dev
```

### 11.3 Update Frontend
In Cloudflare Pages, set environment variable:
```
REACT_APP_API_BASE_URL=https://fixterconnect-api.your-subdomain.workers.dev/api
```

### 11.4 Update CORS in Workers
Update the Hono CORS middleware to allow your Cloudflare Pages URL:
```typescript
app.use('/*', cors({
  origin: ['https://1079739b.fixterapp.pages.dev'],
  credentials: true
}));
```

## Phase 12: Post-Deployment

### 12.1 Monitor Logs
```bash
wrangler tail
```

### 12.2 Test Production
- [ ] User registration
- [ ] User login
- [ ] Browse services
- [ ] Create booking
- [ ] Upload files
- [ ] Admin functions

### 12.3 Performance Optimization
- Enable Cloudflare caching where appropriate
- Review cold start times
- Optimize database queries

## Key Challenges & Solutions

### Challenge 1: Prisma Compatibility
**Solution:** Use Prisma Accelerate with edge client

### Challenge 2: bcrypt Compatibility
**Solution:** Use `@cfworker/bcrypt` or Web Crypto API alternatives

### Challenge 3: File Processing (Sharp)
**Solution:** Use Cloudflare Image Transformations or wasm-based alternatives

### Challenge 4: JWT Signing
**Solution:** Use Hono's built-in JWT middleware or Web Crypto API

### Challenge 5: Session Management
**Solution:** Use JWTs with httpOnly cookies via Hono cookie helpers

## Estimated Timeline

- **Phase 1-2 (Setup):** 2-3 hours
- **Phase 3-4 (Core Migration):** 4-6 hours
- **Phase 5-6 (Middleware & Uploads):** 3-4 hours
- **Phase 7 (Routes):** 10-15 hours (depends on complexity)
- **Phase 8-9 (Config & Env):** 1-2 hours
- **Phase 10 (Testing):** 4-6 hours
- **Phase 11-12 (Deploy & Monitor):** 2-3 hours

**Total Estimated Time:** 26-39 hours

## Resources

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)

## Alternative: Quick Deploy to Railway

If timeline is critical, consider deploying current Express backend to Railway first (30 minutes), then migrate to Workers later as a Phase 2 improvement.

---

**Status:** Planning Phase
**Last Updated:** 2025-11-05
**Priority:** High
