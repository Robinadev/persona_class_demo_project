# Talaritel Deployment Checklist

## Pre-Deployment

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] npm/pnpm package manager available
- [ ] Git repository initialized
- [ ] `.env.local` file created with all required variables
- [ ] `.env.example` reviewed for all possible variables

### Supabase Setup
- [ ] Supabase project created
- [ ] Project URL obtained
- [ ] Anon public key obtained
- [ ] Service role key obtained
- [ ] Auth enabled in Supabase
- [ ] Database selected and accessible

### Local Development
- [ ] Dependencies installed: `npm install`
- [ ] Development server starts: `npm run dev`
- [ ] Landing page loads at http://localhost:3000/landing
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No console errors in browser
- [ ] API health check passes: http://localhost:3000/api/health

### Database Schema
- [ ] Tables created (see below)
- [ ] Indexes created
- [ ] RLS policies enabled
- [ ] Sample data inserted for testing
- [ ] Admin user created
- [ ] Test user created

#### Required Tables
- [ ] `profiles`
- [ ] `wallets`
- [ ] `plans`
- [ ] `subscriptions`
- [ ] `transactions`
- [ ] `calls`
- [ ] `contacts`
- [ ] `transfers`
- [ ] `activity_logs`
- [ ] `admin_users`

### Testing
- [ ] Landing page displays correctly
- [ ] Profile page loads (authenticated)
- [ ] Billing page shows transactions
- [ ] Admin dashboard displays metrics
- [ ] API endpoints respond correctly
- [ ] Database queries work
- [ ] Error handling works
- [ ] Toast notifications appear

### Code Quality
- [ ] ESLint passes: `npm run lint`
- [ ] All imports resolve correctly
- [ ] No unused variables
- [ ] No console.log statements (except debug)
- [ ] Error messages are user-friendly
- [ ] Loading states implemented
- [ ] Error boundaries in place

### Security
- [ ] Environment variables not in git
- [ ] Sensitive data not exposed
- [ ] API routes require authentication
- [ ] RLS policies working
- [ ] CORS configured correctly
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] No hardcoded credentials

## Deployment Preparation

### Code Cleanup
- [ ] Remove debug console.log statements
- [ ] Clean up commented code
- [ ] Remove test data
- [ ] Optimize imports
- [ ] Update metadata for SEO
- [ ] Check favicon configured
- [ ] Theme colors set correctly

### Build Verification
- [ ] Production build succeeds: `npm run build`
- [ ] Build output has no errors
- [ ] Build output has no warnings (or acceptable)
- [ ] Bundle size is reasonable
- [ ] All dependencies resolved
- [ ] Tree-shaking working

### Performance
- [ ] Lighthouse score checked
- [ ] Time to First Paint < 3s
- [ ] Time to Interactive < 5s
- [ ] Core Web Vitals checked
- [ ] Images optimized
- [ ] CSS minified
- [ ] JavaScript minified

## Vercel Deployment

### Repository Setup
- [ ] GitHub/GitLab repository connected
- [ ] Main branch protected
- [ ] Deploy preview branches enabled
- [ ] Repository is public or Vercel has access

### Vercel Project
- [ ] Project created on Vercel
- [ ] Framework auto-detected as Next.js
- [ ] Build command correct: `npm run build`
- [ ] Output directory correct: `.next`
- [ ] Install command correct: `npm install`

### Environment Variables
- [ ] All required env vars added to Vercel
- [ ] Variables marked as sensitive where needed
- [ ] Variables added to all environments (Preview, Production)
- [ ] No hardcoded URLs (use env vars)
- [ ] Database credentials secure

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Domain Configuration
- [ ] Custom domain connected (if applicable)
- [ ] SSL certificate provisioned
- [ ] DNS records configured
- [ ] Domain redirects set up

## Post-Deployment

### Verification
- [ ] Application loads at deployment URL
- [ ] No 404 errors on main pages
- [ ] All API endpoints accessible
- [ ] Database connected successfully
- [ ] Authentication working
- [ ] No console errors in browser
- [ ] All styling applied correctly

### Functionality Testing
- [ ] Landing page works
- [ ] Login/signup flows work
- [ ] User profile page works
- [ ] Billing page loads
- [ ] Admin dashboard accessible
- [ ] API health check passes: `/api/health`
- [ ] Transactions display
- [ ] Calls logged
- [ ] Transfers work

### Performance Verification
- [ ] Lighthouse score acceptable (>90)
- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms
- [ ] Database queries perform well
- [ ] No timeout errors

### Monitoring Setup
- [ ] Error tracking enabled (Sentry optional)
- [ ] Analytics configured (optional)
- [ ] Logging implemented
- [ ] Health checks scheduled
- [ ] Alerts configured

### Database Backup
- [ ] Supabase automated backups enabled
- [ ] Manual backup taken
- [ ] Backup verified restorable
- [ ] Backup retention policy set

## Post-Launch

### Documentation
- [ ] README updated with deployment info
- [ ] API documentation updated
- [ ] Architecture diagram created
- [ ] Troubleshooting guide complete
- [ ] Team onboarded

### Monitoring
- [ ] Error rates monitored
- [ ] Performance metrics tracked
- [ ] User analytics enabled
- [ ] Database performance monitored
- [ ] API rate limits monitored

### Maintenance
- [ ] Regular backup schedule
- [ ] Security updates applied
- [ ] Dependencies updated monthly
- [ ] Performance optimizations ongoing
- [ ] User feedback tracked

## Rollback Plan

- [ ] Previous version tagged in git
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Team trained on rollback
- [ ] Rollback tested before deployment

## Common Issues & Fixes

### Issue: Build Fails
```bash
# Solution: Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Environment Variables Not Loaded
- Check `.env.local` file exists
- Verify Vercel project settings
- Restart dev server after changes

### Issue: Database Connection Error
- Verify Supabase credentials
- Check project is not paused
- Run health check endpoint

### Issue: Authentication Not Working
- Clear browser cookies
- Check Supabase Auth settings
- Verify RLS policies

### Issue: Styling Not Applied
- Clear `.next` folder
- Check tailwind.config.js
- Verify globals.css imports

## Final Sign-Off

- [ ] Product Owner approval
- [ ] QA testing complete
- [ ] Performance acceptable
- [ ] Security review passed
- [ ] Documentation complete
- [ ] Support team trained
- [ ] Monitoring configured
- [ ] Ready for production

---

## Quick Start Commands

```bash
# Setup
npm install
cp .env.example .env.local

# Development
npm run dev

# Testing
npm run lint
npx tsc --noEmit
npm run build

# Database Setup (in Supabase SQL Editor)
# Run: scripts/01-create-tables.sql
# Run: scripts/02-create-indexes.sql
# Run: scripts/03-enable-rls.sql

# Deploy
git push main  # Vercel auto-deploys
```

## Support Contacts

- **Technical Issues**: GitHub Issues
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Team Lead**: [Your contact]

## Sign-Off

- [ ] Deployment completed successfully
- [ ] All tests passing
- [ ] Monitoring active
- [ ] Team notified
- [ ] Stakeholders informed
- [ ] Documentation updated

**Date**: ___________
**Deployed By**: ___________
**Approved By**: ___________
