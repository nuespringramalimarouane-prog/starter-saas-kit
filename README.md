This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# SaaS Starter Kit

A production-ready Next.js starter with authentication, multi-tenant organizations, role-based access control, and Stripe billing — fully self-hosted, no vendor lock-in.

## What's included

- **Auth** — Email/password, Google OAuth, and GitHub OAuth via Auth.js v5
- **Password reset** — Secure token-based flow with rate limiting (3 emails/day) and expiry
- **Multi-tenant orgs** — Every user gets a personal workspace on signup
- **Role-based access** — `ADMIN`, `MEMBER`, `VIEWER` roles per organization
- **Database** — Prisma ORM connected to Neon (serverless Postgres)
- **Email** — Transactional emails via Resend + React Email
- **UI** — shadcn/ui components with Tailwind CSS
- **Toasts** — Sonner for all user-facing feedback

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Auth | Auth.js v5 (NextAuth) |
| Database | Prisma + Neon (serverless Postgres) |
| Email | Resend + React Email |
| UI | shadcn/ui + Tailwind CSS |
| Toasts | Sonner |
| Validation | Zod + react-hook-form |
| Password hashing | bcryptjs |

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/nuespringramalimarouane-prog/starter-saas-kit.git
cd saas-starter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file at the root of the project:

```bash
cp .env.example .env.local
```

Then fill in the values — see the [Environment variables](#environment-variables) section below.

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Generate the Prisma client

```bash
npx prisma generate
```

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Create a `.env.local` file with the following keys:

```bash
# ─── Database (Neon) ───────────────────────────────────────────────────────────
# Get both URLs from console.neon.tech → your project → Connection Details
# Select "Prisma" from the dropdown to get pre-formatted URLs

DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require&pgbouncer=true"
# ─── Auth.js ───────────────────────────────────────────────────────────────────
# Generate with: openssl rand -base64 32

AUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# ─── Google OAuth ──────────────────────────────────────────────────────────────
# console.cloud.google.com → APIs & Services → Credentials → Create OAuth client
# Authorized redirect URI: http://localhost:3000/api/auth/callback/google

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ─── GitHub OAuth ──────────────────────────────────────────────────────────────
# github.com → Settings → Developer settings → OAuth Apps → New OAuth App
# Homepage URL: http://localhost:3000
# Callback URL: http://localhost:3000/api/auth/callback/github

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# ─── Resend (email) ────────────────────────────────────────────────────────────
# resend.com → API Keys → Create API key

RESEND_API_KEY=""
CONTACT_FROM_EMAIL="you@yourdomain.com"
```

> **Note:** `DATABASE_URL` uses Neon's pooled connection (for runtime queries). 
---

## Setting up OAuth providers

### Google

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret into `.env.local`

### GitHub

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click **New OAuth App**
3. Set Homepage URL to `http://localhost:3000`
4. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
5. Copy the Client ID and generate a Client Secret into `.env.local`

---

## Project structure

```
src/
├── app/
│   ├── (auth)/                   # Auth pages (login, register, forgot/reset password)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── (marketing)/              # Public pages (landing, pricing)
│   └── api/
│       └── auth/
│           ├── [...nextauth]/    # Auth.js route handler
│           ├── register/         # POST — create account
│           ├── forgot-password/  # POST — send reset email
│           └── reset-password/   # POST — update password
├── components/
│   ├── auth/
│   │   └── signout-button.tsx
│   ├── providers.tsx             # SessionProvider wrapper
│   └── ui/                       # shadcn components
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── email/
│   │   ├── resend.ts             # Resend client
│   │   └── reset-password.tsx    # React Email template
│   └── validations/
│       └── auth.ts               # Zod schemas
├── proxy.ts                 # Route protection
├── auth.ts                   # Auth.js 
├── auth.condig.ts                   # Auth.js config
└── prisma/
    └── schema.prisma
```

---

## Database schema

The Prisma schema covers all Auth.js required models plus the app-specific models:

| Model | Purpose |
|---|---|
| `User` | Core user — works with both OAuth and credentials |
| `Account` | OAuth provider accounts linked to a user |
| `Session` | Active sessions (database strategy) |
| `VerificationToken` | Email verification tokens |
| `Organization` | Multi-tenant workspace |
| `Membership` | User ↔ Org relationship with role |
| `Invite` | Pending org invitations |
| `PasswordResetToken` | Secure reset tokens with expiry and rate limiting |

### Useful Prisma commands

```bash
# Push schema changes to the database (dev)
npx prisma db push

# Create a migration (production)
npx prisma migrate dev --name your-migration-name

# Regenerate the Prisma client after schema changes
npx prisma generate

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

---

## Auth flow

```
Register (email/password)
  → POST /api/auth/register
  → Hash password with bcrypt
  → Create User + personal Organization + ADMIN Membership
  → Auto sign-in via credentials provider
  → Redirect to /dashboard

Login (email/password)
  → signIn("credentials")
  → Auth.js authorize() validates email + bcrypt hash
  → JWT session created
  → Redirect to /dashboard

Login (Google / GitHub)
  → signIn("google" | "github")
  → OAuth redirect → callback → Auth.js links Account to User
  → JWT session created
  → Redirect to /dashboard

Password reset
  → POST /api/auth/forgot-password (rate limited: 3 emails/24h)
  → Generates secure token, stores with 1h expiry
  → Sends email via Resend
  → User clicks link → /reset-password?token=...
  → POST /api/auth/reset-password validates token (not used, not expired)
  → Updates password, marks token as used
```

---

## Route protection

`proxy.ts` protects all `/dashboard` routes. Any unauthenticated request is redirected to `/login`. Authenticated users hitting `/login` or `/register` are redirected to `/dashboard`.

For role-based protection inside the dashboard, check the user's `Membership.role` against the org:

```ts
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const session = await auth()
const membership = await db.membership.findUnique({
  where: { userId_orgId: { userId: session.user.id, orgId } },
})

if (membership?.role !== "ADMIN") {
  // unauthorized
}
```

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Update OAuth callback URLs to your production domain:
   - Google: `https://yourdomain.com/api/auth/callback/google`
   - GitHub: `https://yourdomain.com/api/auth/callback/github`
5. Update `NEXTAUTH_URL` to your production URL
6. Run `npx prisma migrate deploy` to apply migrations to the production database

---

## License

MIT