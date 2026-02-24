# Talaritel Deployment Guide

## Prerequisites

- Node.js 18+
- Supabase account and project
- npm or pnpm package manager

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_NAME=Talaritel
NODE_ENV=production
```

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talaritel
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials

4. **Set up the database schema**
   
   The database will be initialized automatically when the application starts. However, you can manually set up tables by running the migration scripts in Supabase SQL editor:
   
   - Open Supabase dashboard
   - Go to SQL Editor
   - Run scripts in order:
     - `scripts/01-create-tables.sql`
     - `scripts/02-create-indexes.sql`
     - `scripts/03-enable-rls.sql`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Access the application**
   - Open http://localhost:3000
   - Landing page: http://localhost:3000/landing
   - Admin dashboard: http://localhost:3000/admin/dashboard

## Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **wallets**: User wallet and balance information
- **plans**: Subscription plans
- **subscriptions**: User subscriptions
- **transactions**: Financial transaction history
- **calls**: Call logs and history
- **contacts**: User contact list
- **transfers**: Money transfer logs
- **activity_logs**: System activity tracking
- **admin_users**: Admin user accounts

## Key Features

### Authentication
- Session-based authentication using cookies
- User profile management
- Admin authentication

### Wallet System
- Balance tracking in ETB (Ethiopian Birr)
- Top-up functionality
- Wallet operations logging

### Communication
- Call logging with duration and costs
- Contact management
- Money transfer system

### Admin Dashboard
- User analytics
- Call statistics
- Revenue tracking
- Transaction monitoring
- Plan management
- Admin user management

## Deployment to Vercel

1. **Connect your repository to Vercel**
   - Go to vercel.com and sign in
   - Click "Import Project"
   - Select your GitHub repository

2. **Configure environment variables**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables from `.env.local`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy the application

## Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env.local`
- Check that Supabase project is active
- Ensure service role key has proper permissions

### Missing Tables
- Run the migration scripts manually in Supabase SQL editor
- Check that RLS policies are enabled
- Verify user has appropriate permissions

### Authentication Issues
- Clear browser cookies
- Check that session is being set properly
- Verify authentication routes are accessible

## Support

For issues or questions:
1. Check the GitHub issues section
2. Review Supabase documentation
3. Contact the development team

## Performance Optimization

- Images are optimized with Next.js Image component
- Database queries use indexes for faster retrieval
- API responses are cached where appropriate
- RLS policies ensure efficient data filtering

## Security Considerations

- All API routes require authentication
- Sensitive data is protected by RLS policies
- Passwords should be hashed using bcrypt
- API keys are stored securely in environment variables
- CORS is properly configured
