"use client"

import { useMe } from "@/hooks/use-me"
import { PLANS, type Plan } from "@/lib/plans"
import { UpgradeButton } from "@/components/billing/upgrade-button"
import { ManageBillingButton } from "@/components/billing/manage-billing-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2 } from "lucide-react"

export default function BillingPage() {
  const { data, loading } = useMe()

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (!data) return null
  if (!data.org) return null

  const currentPlan = (data.org.plan as Plan) ?? "free"
  const isAdmin = data.role === "ADMIN"


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your subscription and billing details.
        </p>
      </div>

      {currentPlan !== "free" && data.org.periodEnd && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{currentPlan} plan — active</p>
                <p className="text-sm text-muted-foreground">
                  Renews on{" "}
                  {new Date(data.org.periodEnd).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {isAdmin && <ManageBillingButton orgId={data.org.id} />}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {(Object.entries(PLANS) as [Plan, typeof PLANS[Plan]][]).map(([key, plan]) => {
          const isCurrent = currentPlan === key
          const members = plan.limits.members;
          return (
            <Card
              key={key}
              className={isCurrent ? "border-primary ring-1 ring-primary" : ""}
            >
              <CardHeader>
                <CardTitle className="capitalize">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {plan.limits.members === Infinity
                      ? "Unlimited members"
                      : `Up to ${plan.limits.members} member${members > 1 && "s"}`}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {plan.limits.projects === Infinity
                      ? "Unlimited projects"
                      : `Up to ${plan.limits.projects} projects`}
                  </li>
                </ul>

                {isAdmin && !isCurrent && key !== "free" && (
                  <UpgradeButton
                    orgId={data.org.id}
                    priceId={
                      key === "pro"
                        ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!
                        : process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID!
                    }
                    label={`Upgrade to ${plan.name}`}
                  />
                )}

                {isCurrent && (
                  <p className="text-xs text-primary font-medium">✓ Current plan</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}