# SaaS Starter Kit

A full-stack SaaS starter built with Next.js, TypeScript, Auth.js, Prisma, and PostgreSQL. It provides a foundation for applications that need authentication, organization workspaces, role-based access, password recovery, and transactional email.

> This repository is a starter kit. Review the configuration, security settings, and deployment environment before using it in a production application.

## Features

- **Authentication:** Email/password, Google OAuth, and GitHub OAuth through Auth.js v5.
- **Password recovery:** Token-based reset flow with expiry and rate limiting.
- **Organizations:** A personal workspace is created when a user registers.
- **Access control:** Organization membership roles: `ADMIN`, `MEMBER`, and `VIEWER`.
- **Database:** Prisma ORM with PostgreSQL (configured for Neon).
- **Email:** Resend and React Email for transactional messages.
- **UI:** Tailwind CSS, shadcn/ui, and Sonner notifications.
- **Validation:** Zod and React Hook Form.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Authentication | Auth.js v5 |
| Database | Prisma + Neon PostgreSQL |
| Email | Resend + React Email |
| UI | shadcn/ui + Tailwind CSS |
| Validation | Zod + React Hook Form |
| Password hashing | bcryptjs |

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/nuespringramalimarouane-prog/starter-saas-kit.git
cd starter-saas-kit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the values described in the [Environment variables](#environment-variables) section. Never commit real credentials, API keys, OAuth secrets, or production database URLs.

### 4. Set up Prisma

```bash
npx prisma db push
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file in the project root and configure the required services:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
AUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

RESEND_API_KEY=""
CONTACT_FROM_EMAIL="you@example.com"
```

Use the connection URLs and credentials from your own Neon, Google Cloud, GitHub OAuth, and Resend projects. Generate a strong `AUTH_SECRET` and keep all secrets outside version control.

## OAuth setup

### Google

1. Create an OAuth client in Google Cloud Console.
2. Add the local callback URL: `http://localhost:3000/api/auth/callback/google`.
3. Add the resulting client ID and secret to `.env.local`.

### GitHub

1. Create an OAuth App under GitHub Developer Settings.
2. Set the homepage URL to `http://localhost:3000`.
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`.
4. Add the client ID and secret to `.env.local`.

For deployment, replace the local URLs with the application's actual domain.

## Project structure

The application is organized around authentication, protected dashboard pages, shared UI components, server utilities, and the Prisma schema.

```text
src/
├── app/
│   ├── (auth)/                   # Login, registration, and password recovery
│   ├── (dashboard)/              # Protected application routes
│   ├── (marketing)/              # Public landing and pricing pages
│   └── api/
│       └── auth/                 # Auth.js and account-related endpoints
├── components/                   # Shared and feature-specific UI
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── email/                    # Resend client and email templates
│   └── validations/               # Zod schemas
├── proxy.ts                      # Route protection
├── auth.ts                       # Auth.js configuration
└── prisma/
    └── schema.prisma             # Database models
```

Refer to the source tree for the exact implementation and file names.

## Database models

The Prisma schema includes the Auth.js models and application-specific organization models.

| Model | Purpose |
|---|---|
| `User` | User account |
| `Account` | Linked OAuth provider account |
| `Session` | User session |
| `VerificationToken` | Verification token |
| `Organization` | Workspace |
| `Membership` | User-to-organization relationship and role |
| `Invite` | Organization invitation |
| `PasswordResetToken` | Password reset token with expiry and usage state |

Useful Prisma commands:

```bash
# Push the schema during development
npx prisma db push

# Create a migration
npx prisma migrate dev --name describe-your-change

# Apply migrations in production
npx prisma migrate deploy

# Regenerate the Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Authentication flows

### Registration

1. The registration endpoint validates the submitted data.
2. The password is hashed before storage.
3. A user, personal organization, and admin membership are created.
4. The user is signed in and redirected to the dashboard.

### Sign in

Users can authenticate with email/password or a configured Google or GitHub OAuth provider.

### Password reset

The reset flow creates a time-limited token, sends a reset email through Resend, validates the token when the user submits a new password, and marks the token as used.

## Route protection and authorization

The project includes a `proxy.ts` route-protection layer. Verify the exact redirect and matcher behavior in the current source before relying on it. Authentication alone is not sufficient for organization-level authorization: server-side actions should also verify the current user's membership and role for the requested organization.

Before performing an organization-level operation, retrieve the current user's membership for that organization and enforce the required role on the server. Do not rely on client-side UI visibility as an authorization check.

## Deployment

For a deployment:

1. Deploy the application to your chosen hosting provider.
2. Configure every required environment variable in the hosting dashboard.
3. Use the production database URL and apply migrations with `npx prisma migrate deploy`.
4. Update Google and GitHub OAuth callback URLs to the production domain.
5. Set the production application URL in the authentication configuration.
6. Verify registration, sign-in, password recovery, email delivery, and organization access before release.

## Security checklist

- Keep `.env.local` and all credentials out of Git.
- Use a strong, unique authentication secret.
- Use HTTPS in production.
- Restrict OAuth callback URLs to the intended domains.
- Verify organization membership and roles on the server for every protected operation.
- Review rate limits, email configuration, session behavior, and database access before production use.

## License

MIT
