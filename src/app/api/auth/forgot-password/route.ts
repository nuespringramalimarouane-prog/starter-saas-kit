import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import crypto from "node:crypto"
import { resend } from "@/lib/email/resend"
import ResetPasswordEmail from "@/lib/email/reset-password"
import { createElement } from "react"

const DAILY_LIMIT = 3

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || typeof email !== "string") {
    return NextResponse.json({ success: true }) // don't reveal anything
  }

  const user = await db.user.findUnique({ where: { email } })

  // Always return success — don't reveal if email exists
  if (!user) {
    return NextResponse.json({ success: true })
  }

  // ── Rate limit: count tokens created in the last 24h ──────────────
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24)

  const recentCount = await db.passwordResetToken.count({
    where: {
      userId: user.id,
      createdAt: { gte: since },
    },
  })

  if (recentCount >= DAILY_LIMIT) {
    // Still return 200 — don't tell attackers the limit was hit
    // The user will simply not receive another email
    return NextResponse.json({ success: true })
  }

  // ── Invalidate all previous unused tokens for this user ───────────
  await db.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      used: false,
      expires: { gt: new Date() }, // only delete still-valid ones
    },
  })

  // ── Create new token ──────────────────────────────────────────────
  const token = crypto.randomBytes(32).toString("hex")

  await db.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  })

  const url = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
    to: user.email,
    subject: "Reset your password",
    react: createElement(ResetPasswordEmail, { url }),
  })

  return NextResponse.json({ success: true })
}