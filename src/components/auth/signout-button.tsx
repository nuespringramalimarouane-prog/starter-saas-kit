// src/components/auth/signout-button.tsx
"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive"
  showIcon?: boolean
  className?: string
}

export function SignOutButton({
  variant = "ghost",
  showIcon = true,
  className,
}: Readonly<SignOutButtonProps>) {
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    toast.loading("Signing out…")
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleSignOut}
      disabled={loading}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {loading ? "Signing out…" : "Sign out"}
    </Button>
  )
}