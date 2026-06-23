// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { name, email, password } = parsed.data

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  const user = await db.user.create({
    data: { name, email, password: hashed },
  })

  // Auto-create a personal org for new users
  const slug = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-")
  await db.organization.create({
    data: {
      name: `${name}'s workspace`,
      slug: `${slug}-${user.id.slice(0, 6)}`,
      memberships: {
        create: { userId: user.id, role: "ADMIN" },
      },
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}