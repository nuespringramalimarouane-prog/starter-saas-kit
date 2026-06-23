import { Suspense } from "react"
import ResetPasswordForm from "./reset-password-form"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  )
}