# Prisma Accelerate Setup Guide

## Current Issue
Getting error: `"Accelerate is not enabled or it is improperly configured"` (error code P6010)

## Steps to Complete Setup

### 1. Go to Prisma Console
Visit: https://console.prisma.io/

### 2. Select Your Project
- Click on your project (if you have multiple)
- You should see the Accelerate setup wizard

### 3. Enable Accelerate
Look for these options in your project settings:
- **Enable Accelerate** toggle - make sure this is ON
- **Database Connection** - verify your Supabase connection string is correct

### 4. Configure Database Connection in Prisma Console
Your Supabase connection string should be:
```
postgresql://postgres.ozprqzqmdzvtatlaemnf:LNX+nDM4nnbH/rG@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

**CRITICAL - Password Encoding**:
- In the Prisma Console, use the **UNENCODED** password: `LNX+nDM4nnbH/rG`
- Do NOT use URL-encoded characters like `%2B` or `%2F`
- The password contains special characters (`+` and `/`) which should be entered as-is

**Important**: In the Prisma Console:
- Add this as your "Database Connection String"
- Make sure it's using the direct connection (port 5432, NOT 6543)
- Click "Test Connection" to verify it works
- Wait for green checkmark or "Connected" status

### 5. Verify Accelerate API Key
Your API key is already in `.dev.vars`:
```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Wait for Activation
After configuring the database connection in Prisma Console:
- The status should change from "Waiting for a query..." to "Active" or "Connected"
- This may take a few minutes
- Try refreshing the Prisma Console page

### 7. Test the Connection
Once Accelerate shows as active in the console, restart Wrangler dev:
```bash
cd /Users/codylockwood/FixterConnect/fixterconnect/packages/server
npm run dev:worker
```

Then test the login endpoint:
```bash
curl -X POST http://localhost:8787/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass","userType":"client"}'
```

## Alternative: Use Direct Connection for Local Dev

If Prisma Accelerate setup is taking too long, we can temporarily use the direct Supabase connection for local development:

### Option A: Modify .dev.vars (Temporary)
Replace the DATABASE_URL in `.dev.vars` with:
```
DATABASE_URL="postgresql://postgres.ozprqzqmdzvtatlaemnf:LNX%2BnDM4nnbH%2FrG@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

**Note**: This will only work for local development. For production Cloudflare Workers deployment, you MUST use Prisma Accelerate.

### Option B: Continue with Express Server
Keep using the Express server (`npm run dev`) which already works with direct connections, and only switch to Workers once Accelerate is ready.

## Troubleshooting

### Error: "Accelerate is not enabled"
**Solution**: In Prisma Console, go to Project Settings → Accelerate → Enable

### Error: "Database connection failed"
**Solution**:
1. Check your Supabase database is running
2. Verify the connection string is correct
3. Make sure Supabase firewall allows Prisma's IP addresses

### Error: "Invalid API key"
**Solution**: Generate a new Accelerate API key in Prisma Console

### Still Not Working?
Contact Prisma support or check their documentation:
- https://www.prisma.io/docs/accelerate
- https://www.prisma.io/docs/accelerate/getting-started

## Next Steps After Accelerate is Working
1. ✅ Test login endpoint
2. ✅ Convert remaining routes to Hono format
3. ✅ Migrate file uploads to R2
4. ✅ Deploy to Cloudflare Workers
5. ✅ Update frontend to use Workers URL
