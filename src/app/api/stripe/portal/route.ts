import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orgId } = await req.json()

  const membership = await db.membership.findUnique({
    where: { userId_orgId: { userId: session.user.id, orgId } },
  })

  if (membership?.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can manage billing" }, { status: 403 })
  }

  const org = await db.organization.findUnique({ where: { id: orgId } })

  if (!org?.stripeId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: org.stripeId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}