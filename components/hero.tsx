"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { AudioLines, Mic, Music2, Sparkles, Wand2 } from "lucide-react"

export function Hero() {
  const router = useRouter()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signup")

  // Allow ?login=1 to auto-open the modal (used by middleware redirect).
  useEffect(() => {
    if (params.get("login") === "1") {
      setMode("signin")
      setOpen(true)
    }
  }, [params])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next && params.get("login")) {
      // Clean the URL after the modal closes
      router.replace("/")
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* subtle radial accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[600px] bg-[radial-gradient(ellipse_at_top,theme(colors.foreground/8%),transparent_60%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
            <AudioLines className="size-4" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">isola.ai</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMode("signin")
              setOpen(true)
            }}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setMode("signup")
              setOpen(true)
            }}
          >
            Get started
          </Button>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-16 pb-24 text-center md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" />
          <span>AI-powered audio isolation</span>
        </div>

        <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
          Pull vocals, drums, and instruments out of any track.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Isola separates any song into clean stems in seconds. Upload a track, get studio-quality vocals, drums, bass,
          and instrumentals — ready to remix, sample, or practice with.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-6 text-base"
            onClick={() => {
              setMode("signup")
              setOpen(true)
            }}
          >
            Start isolating audio
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-6 text-base bg-transparent"
            onClick={() => {
              setMode("signin")
              setOpen(true)
            }}
          >
            Sign in
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required. Your first 3 isolations are on us.
        </p>
      </section>

      <section className="relative z-10 mx-auto grid w-full max-w-5xl gap-4 px-6 pb-24 md:grid-cols-3">
        <FeatureCard
          icon={<Mic className="size-5" />}
          title="Vocal isolation"
          body="Extract a cappella vocals or instrumentals with state-of-the-art source separation."
        />
        <FeatureCard
          icon={<Music2 className="size-5" />}
          title="Stem splitting"
          body="Split tracks into vocals, drums, bass, and other — perfect for remixing and sampling."
        />
        <FeatureCard
          icon={<Wand2 className="size-5" />}
          title="Studio quality"
          body="Trained on millions of songs to deliver clean, artifact-free stems every time."
        />
      </section>

      <AuthModal open={open} onOpenChange={handleOpenChange} defaultMode={mode} />
    </main>
  )
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}
