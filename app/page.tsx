import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { WhyBlob } from "@/components/why-blob"
import { Products } from "@/components/products"
import { FAQ } from "@/components/faq"
import { Mission } from "@/components/mission"

export default async function Home() {

  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <WhyBlob />
      <Products />
      <FAQ />
      <Mission />
    </main>
  )
}
