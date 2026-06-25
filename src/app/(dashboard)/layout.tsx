import { Toaster } from "@/components/ui/sonner"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardShell>{children}</DashboardShell>
      <Toaster richColors position="top-right" />
    </div>
  )
}