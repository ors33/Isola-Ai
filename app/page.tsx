import { Suspense } from "react"
import { Hero } from "@/components/hero"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Hero />
    </Suspense>
  )
}
