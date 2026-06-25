"use client"

import { useEffect, useState } from "react"

export interface MeData {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  org: {
    id: string
    name: string
    slug: string
    plan: string
    stripeId: string | null
    subscriptionId: string | null
    periodEnd: string | null
    createdAt: string
    updatedAt: string
  }
  role: "ADMIN" | "MEMBER" | "VIEWER"
  memberCount: number
}

export function useMe() {
  const [data, setData] = useState<MeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => {
        if (res.status === 401) {
          globalThis.location.href = "/login"
          return null
        }
        return res.json()
      })
      .then((json) => {
        if (json) setData(json)
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}