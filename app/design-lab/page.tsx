import { Metadata } from "next"
import DesignerWrapper from "@/components/designer/designer-wrapper"

export const metadata: Metadata = {
  title: "صمم منتجك الخاص | طباعة هوديات وتيشيرتات - BLOBJOR",
  description: "استخدم Design Lab من بلوب لتصميم الهودي أو التيشيرت الخاص بك. ارفع صورتك، اكتب عبارتك، واحنا بنطبعها وبنوصلها لباب بيتك في الأردن.",
  openGraph: {
    title: "صمم منتجك الخاص | طباعة هوديات وتيشيرتات - BLOBJOR",
    description: "استخدم Design Lab من بلوب لتصميم الهودي أو التيشيرت الخاص بك. ارفع صورتك، اكتب عبارتك، واحنا بنطبعها وبنوصلها لباب بيتك في الأردن.",
    images: ["/og-design-lab.png"],
  },
}

export default function DesignLabPage() {
  return (
    <main className="min-h-screen bg-black pt-[80px]">
      <DesignerWrapper />
    </main>
  )
}
