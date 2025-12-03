import { redirect } from "next/navigation"
import { auth } from "@/lib/auth" // Import the new 'auth' function
import { SignupForm } from "@/components/auth/signup-form"

export default async function SignUpPage() {
  // Get the session using the new auth() function
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
      <div className="relative z-10 w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}