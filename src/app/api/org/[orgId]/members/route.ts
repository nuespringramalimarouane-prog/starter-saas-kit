import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // verify the requester belongs to this org
  const requesterMembership = await db.membership.findUnique({
    where: {
      userId_orgId: {
        userId: session.user.id,
        orgId: (await params).orgId,
      },
    },
  })

  if (!requesterMembership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const members = await db.membership.findMany({
    where: { orgId: (await params).orgId },
    include: { user: true },
    orderBy: { user: { createdAt: "asc" } },
  })

  return NextResponse.json({
    members: members.map((m) => ({
      role: m.role,
      user: {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        image: m.user.image,
      },
    })),
  })
}