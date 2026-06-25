"use client"

import { useMe } from "@/hooks/use-me"
import { PLANS, type Plan } from "@/lib/plans"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, FolderOpen, CreditCard } from "lucide-react"

export default function OverviewPage() {
  const { data, loading } = useMe()

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (!data) return null
  
  if (!data.user) return null

  const plan = (data?.org?.plan as Plan) ?? "free"
  const limits = PLANS[plan].limits

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {data.user.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{plan}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${PLANS[plan].price}/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data.memberCount}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {limits.members === Infinity ? "∞" : limits.members}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">seats used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              0{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {limits.projects === Infinity ? "∞" : limits.projects}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">projects created</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}