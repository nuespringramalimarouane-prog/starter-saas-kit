import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">

      <div className="max-w-xl space-y-4">

        <h1 className="text-4xl font-bold">
          Welcome to SaaS Starter
        </h1>

        <p className="text-muted-foreground">
          Build, manage, and scale your projects with a modern platform.
          Create your account to get started or sign in if you already have one.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            href="/register"
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground hover:opacity-90"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="rounded-md border px-5 py-2 hover:bg-accent"
          >
            Login
          </Link>

        </div>

      </div>

    </main>
  )
}