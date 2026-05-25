"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

type Mode = "signin" | "signup"

export function AuthModal({
  open,
  onOpenChange,
  defaultMode = "signin",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultMode?: Mode
}) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setError(null)
    setInfo(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    reset()
    setLoading(true)

    const supabase = createClient()

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
          },
        })

        if (signUpError) throw signUpError

        // If email confirmation is OFF, signUp returns a session immediately and we're done.
        if (data.session) {
          onOpenChange(false)
          router.push("/dashboard")
          router.refresh()
          return
        }

        // If email confirmation is ON, signUp returns user but no session.
        // Try signing in directly — this works if the user already exists or
        // if confirmation is not required at the auth-server level.
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (!signInError) {
          onOpenChange(false)
          router.push("/dashboard")
          router.refresh()
          return
        }

        // Fall through: confirmation is required by the project.
        setInfo(
          "Account created. Check your email for a confirmation link, then sign in. (To skip this step, disable email confirmation in your Supabase project's Auth settings.)",
        )
        setMode("signin")
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        onOpenChange(false)
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) reset()
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign in to Isola" : "Create your Isola account"}</DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Welcome back. Enter your email and password."
              : "Start isolating vocals and instruments in seconds."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-sm text-muted-foreground">
              {info}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "signin" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>

          <button
            type="button"
            onClick={() => {
              reset()
              setMode(mode === "signin" ? "signup" : "signin")
            }}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
