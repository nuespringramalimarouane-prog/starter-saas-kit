"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface UpgradeButtonProps {
  orgId: string
  priceId: string
  label?: string
}

export function UpgradeButton({ orgId, priceId, label = "Upgrade" }: Readonly<UpgradeButtonProps>) {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId, priceId }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    window.location.href = data.url
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading}>
      {loading ? "Redirecting…" : label}
    </Button>
  )
}