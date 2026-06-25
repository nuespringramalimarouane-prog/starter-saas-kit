import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()


  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }


  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { org: true },
  })

  if (!membership) {
    return NextResponse.json({ error: "No membership found" }, { status: 404 })
  }


  const memberCount = await db.membership.count({
    where: { orgId: membership.orgId },
  })


  return NextResponse.json({
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
    org: membership?.org,
    role: membership.role,
    memberCount,
  })
}