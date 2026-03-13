# Talaritel Admin Panel

Independent Next.js application for managing the Talaritel platform.

## Features

- **User Management** - View and manage user accounts
- **Analytics & Insights** - Real-time platform analytics and performance metrics
- **Settings** - Admin profile and security settings
- **Authentication** - Secure admin-only access with role-based control
- **Responsive Design** - Mobile-friendly interface with professional fintech styling

## Directory Structure

```
admin-panel/
├── app/
│   ├── (dashboard)/          # Dashboard routes
│   │   ├── page.tsx          # Dashboard home
│   │   ├── users/            # Users management
│   │   ├── insights/         # Analytics & insights
│   │   ├── settings/         # Settings page
│   │   └── layout.tsx        # Dashboard layout with auth
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # UI components (button, etc.)
│   └── admin-navbar.tsx      # Admin navigation bar
├── lib/
│   ├── auth-service.ts       # Supabase auth
│   └── utils.ts              # Utility functions
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
├── next.config.js            # Next.js config
└── .env.local                # Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account and project

### Installation

1. Install dependencies:
```bash
cd admin-panel
npm install
```

2. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Run development server:
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

## Authentication

The admin panel uses Supabase authentication and requires users to have one of these roles:
- `super_admin` - Full platform access
- `admin` - Administrative access
- `support` - Support access

## Database Connection

The app connects to your Supabase database to manage:
- User profiles
- Call records
- Transactions
- Activity logs

## Development

### Available Scripts

- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Architecture

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Components**: Custom React components + shadcn/ui
- **State Management**: React hooks + Sonner for toasts
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

### Docker Deployment

```bash
docker build -t admin-panel .
docker run -p 3001:3001 admin-panel
```

## Contributing

Follow these guidelines:
- Use TypeScript for type safety
- Component-based architecture
- Responsive design first
- Follow existing patterns

## Support

For issues or questions, contact the development team.

## License

Proprietary - Talaritel Inc.
