"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Chrome, Loader2 } from "lucide-react"

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Registration successful, but sign-in failed. Please try signing in manually.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      setError("Google sign-in failed. Please try again.")
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="w-full max-w-md mx-auto glass-panel border-white/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">Create account</CardTitle>
        <CardDescription className="text-center text-gray-400">Join the KushalX SkillSwap community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white" onClick={handleGoogleSignIn} disabled={isLoading}>
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500">Or create account with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-300">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleInputChange}
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">Bio (Optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto font-semibold text-purple-400 hover:text-purple-300" onClick={() => router.push("/auth/signin")}>
            Sign in
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
