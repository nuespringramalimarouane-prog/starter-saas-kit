"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function ManageBillingButton({ orgId }: Readonly<{ orgId: string }>) {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    setLoading(true)

    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    globalThis.location.href = data.url
  }

  return (
    <Button variant="outline" onClick={handlePortal} disabled={loading}>
      {loading ? "Opening…" : "Manage billing"}
    </Button>
  )
}