import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const getOrgId = (metadata: Stripe.Metadata | null) =>
    metadata?.orgId ?? null

  const getPeriodEnd = (subscription: Stripe.Subscription): Date => {
    // current_period_end moved to subscription.items in newer Stripe API versions
    const item = subscription.items.data[0]
    const timestamp =
      (item as unknown as { current_period_end?: number }).current_period_end
      ?? subscription.items.data[0].price.created // fallback — should never hit
    return new Date(timestamp * 1000)
  }

  const getPlan = (subscription: Stripe.Subscription): string => {
    const priceId = subscription.items.data[0].price.id
    return priceId === process.env.STRIPE_TEAM_PRICE_ID ? "team" : "pro"
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const orgId = getOrgId(session.metadata)
      if (!orgId || !session.subscription) break

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await db.organization.update({
        where: { id: orgId },
        data: {
          plan: getPlan(subscription),
          stripeId: subscription.id,
          periodEnd: getPeriodEnd(subscription),
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      const orgId = getOrgId(subscription.metadata)
      if (!orgId) break

      await db.organization.update({
        where: { id: orgId },
        data: {
          plan: getPlan(subscription),
          stripeId: subscription.id,
          periodEnd: getPeriodEnd(subscription),
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const orgId = getOrgId(subscription.metadata)
      if (!orgId) break

      await db.organization.update({
        where: { id: orgId },
        data: {
          plan: "free",
          stripeId: null,
          periodEnd: null,
        },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}