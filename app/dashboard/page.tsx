import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"
import { AudioLines } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/?login=1")

  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
            <AudioLines className="size-4" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">isola.ai</span>
        </div>
        <SignOutButton />
      </header>

      <section className="mx-auto w-full max-w-5xl px-6 py-12">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Welcome back, {user.email?.split("@")[0]}.
        </h1>
        <p className="mt-2 text-muted-foreground">Upload a track to start isolating stems.</p>

        <div className="mt-10 rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <AudioLines className="mx-auto mb-4 size-8 text-muted-foreground" />
          <p className="font-medium">Drop an audio file here</p>
          <p className="mt-1 text-sm text-muted-foreground">MP3, WAV, FLAC up to 50MB</p>
          <Button className="mt-6">Choose file</Button>
        </div>
      </section>
    </main>
  )
}
