import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { token, password } = parsed.data

  const reset = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  })

  // ── Validate token ────────────────────────────────────────────────
  if (!reset) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 })
  }

  if (reset.used) {
    return NextResponse.json({ error: "This link has already been used" }, { status: 400 })
  }

  if (reset.expires < new Date()) {
    // Clean it up
    await db.passwordResetToken.delete({ where: { token } })
    return NextResponse.json({ error: "This link has expired. Please request a new one." }, { status: 400 })
  }

  // ── Update password ───────────────────────────────────────────────
  const hashed = await bcrypt.hash(password, 12)

  await db.user.update({
    where: { id: reset.userId },
    data: { password: hashed },
  })

  // ── Mark token as used (not deleted — keeps audit trail) ──────────
  await db.passwordResetToken.update({
    where: { token },
    data: { used: true },
  })

  return NextResponse.json({ success: true })
}