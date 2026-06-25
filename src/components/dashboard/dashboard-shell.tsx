"use client"

import { useMe } from "@/hooks/use-me"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Organization } from "@/generated/prisma/client"

export function DashboardShell({ children }:Readonly<{ children: React.ReactNode }>) {
  const { data, loading } = useMe()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <>
      <Sidebar org={data.org as Organization} user={data.user} role={data.role} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </>
  )
}