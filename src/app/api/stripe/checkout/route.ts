import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orgId, priceId } = await req.json()

  if (!orgId || !priceId) {
    return NextResponse.json({ error: "Missing orgId or priceId" }, { status: 400 })
  }

  // Check user is ADMIN of this org
  const membership = await db.membership.findUnique({
    where: {
      userId_orgId: { userId: session.user.id, orgId },
    },
  })

  if (membership?.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can manage billing" }, { status: 403 })
  }

  const org = await db.organization.findUnique({ where: { id: orgId } })

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 })
  }

  // Create Stripe customer if one doesn't exist yet
  let stripeCustomerId = org.stripeId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      name: org.name,
      email: session.user.email!,
      metadata: { orgId: org.id },
    })

    stripeCustomerId = customer.id

    await db.organization.update({
      where: { id: orgId },
      data: { stripeId: stripeCustomerId },
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
    metadata: { orgId },
    subscription_data: {
      metadata: { orgId },
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}