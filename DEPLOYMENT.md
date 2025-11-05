# Deployment Guide - FixterConnect

## Cloudflare Pages Deployment

### Build Configuration

When setting up your Cloudflare Pages project, use the following build settings:

**Framework preset:** `Create React App`

**Build command:**
```bash
cd fixterconnect/packages/web && npm install && npm run build
```

**Build output directory:**
```
fixterconnect/packages/web/build
```

**Root directory:**
```
/
```

**Node version:** `18` or higher

### Environment Variables

Set the following environment variables in Cloudflare Pages dashboard:

```
REACT_APP_API_URL=https://your-backend-api-url.com
```

If you have other environment variables, add them here.

### Post-Deployment Setup

After deployment:

1. **Configure custom domain** (if applicable)
2. **Set up redirects** - The `_redirects` file in the `public` folder handles SPA routing
3. **Test all routes** to ensure the React Router works correctly

### Troubleshooting

**Build fails with "Missing script: build"**
- Ensure the build command includes `cd fixterconnect/packages/web`
- Verify package.json has `"build": "react-scripts build"` in scripts

**404 on page refresh**
- Check that `_redirects` file exists in `public` folder
- Ensure Cloudflare Pages is reading the redirects file

**API calls failing**
- Verify `REACT_APP_API_URL` environment variable is set
- Check CORS settings on your backend server
- Ensure API endpoints are accessible from Cloudflare

### Backend Deployment

The backend server needs to be deployed separately. Options include:

1. **Cloudflare Workers** - For serverless deployment
2. **Railway** - Easy Node.js hosting
3. **Render** - Free tier available
4. **Heroku** - Traditional PaaS
5. **AWS EC2/ECS** - Full control

#### Backend Environment Variables

Ensure these are set in your backend deployment:

```
DATABASE_URL=your-postgresql-connection-string
PORT=3001
NODE_ENV=production
STRIPE_SECRET_KEY=your-stripe-key
# Add other backend env vars
```

### Full Stack Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database (Supabase) is live and migrations applied
- [ ] Frontend environment variables configured
- [ ] Backend environment variables configured
- [ ] CORS configured to allow frontend domain
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates active
- [ ] Test user registration flow
- [ ] Test contractor registration flow
- [ ] Test booking flow
- [ ] Test payment integration
- [ ] Test admin dashboard
- [ ] Monitor error logs

### Continuous Deployment

Cloudflare Pages automatically deploys when you push to your connected Git repository:

- **Production branch:** `main` (or configure in Cloudflare dashboard)
- **Preview deployments:** Created for all other branches/PRs

### Performance Optimization

- Build output is automatically optimized by react-scripts
- Cloudflare CDN handles caching and distribution
- Consider enabling Cloudflare's Web Analytics
- Monitor Core Web Vitals in production

---

**Last Updated:** 2025-11-04
