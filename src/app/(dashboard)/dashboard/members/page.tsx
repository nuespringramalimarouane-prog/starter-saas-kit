"use client"

import { useEffect, useState } from "react"
import { useMe } from "@/hooks/use-me"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Member {
  role: "ADMIN" | "MEMBER" | "VIEWER"
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

export default function MembersPage() {
  const { data, loading } = useMe()
  const [members, setMembers] = useState<Member[]>([])
  const [membersLoading, setMembersLoading] = useState(true)

  useEffect(() => {
    if (!data?.org?.id) return

    fetch(`/api/org/${data.org.id}/members`)
      .then((res) => res.json())
      .then((json) => setMembers(json.members ?? []))
      .finally(() => setMembersLoading(false))
  }, [data?.org?.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!data) return null
  if (!data.org) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Members</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {data.memberCount} member{data.memberCount == 1 ? "" : "s"} in {data.org.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {membersLoading ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            members.map(({ user, role }) => {
              const initials = user.name
                ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                : "?"

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
                    {role.toLowerCase()}
                  </Badge>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}