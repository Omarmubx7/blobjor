import { Metadata } from "next"
import DesignerWrapper from "@/components/designer/designer-wrapper"

export const metadata: Metadata = {
  title: "Design Lab - صمم بنفسك | blobjor.me",
  description: "صمم هودي أو كوب مخصص بأسلوبك الخاص. أداة تصميم احترافية مع معاينة واقعية فورية.",
  openGraph: {
    title: "Design Lab - صمم بنفسك | blobjor.me",
    description: "أداة تصميم احترافية مع معاينة واقعية لمنتجاتك المخصصة",
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
