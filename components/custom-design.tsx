"use client"

import { useState } from "react"
import { Upload, Palette } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type ProductType = "hoodie" | "mug"
type DesignSide = "front" | "back"

const hoodieColors = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#000000" },
  { id: "heather-grey", name: "Heather Grey", hex: "#9CA3AF" },
  { id: "navy", name: "Navy", hex: "#1E3A5F" },
  { id: "royal-blue", name: "Royal Blue", hex: "#1D4ED8" },
  { id: "forest-green", name: "Forest Green", hex: "#166534" },
  { id: "maroon", name: "Maroon", hex: "#7F1D1D" },
  { id: "sport-grey", name: "Sport Grey", hex: "#6B7280" },
]

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"]

export function CustomDesign() {
  const [productType, setProductType] = useState<ProductType>("hoodie")
  const [designSide, setDesignSide] = useState<DesignSide>("front")
  const [selectedColor, setSelectedColor] = useState("black")
  const [selectedSize, setSelectedSize] = useState("M")
  const [uploadedImages, setUploadedImages] = useState(0)
  const { ref, isVisible } = useScrollAnimation()

  const selectedColorData = hoodieColors.find(c => c.id === selectedColor)
  const price = productType === "hoodie" ? 12 : 3

  return (
    <section id="custom" className="bg-foreground py-16 lg:py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-[1400px] px-4 transition-all duration-700 lg:px-8 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Section Header */}
        <div className="mb-10 text-center lg:mb-16">
          <span className="mb-2 block font-body text-sm font-medium text-accent">
            CUSTOM DESIGNER
          </span>
          <h2 className="font-sans text-3xl font-black tracking-tight text-primary-foreground lg:text-4xl">
            تصميم مخصص
          </h2>
          <p className="mt-3 font-body text-base text-primary-foreground/70">
            صمم هوديتك أو كوبك الخاص
          </p>
        </div>

        {/* Product Type Toggle */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full bg-primary-foreground/10 p-1">
            <button
              onClick={() => setProductType("hoodie")}
              className={`rounded-full px-6 py-2.5 font-body text-sm font-semibold transition-all ${
                productType === "hoodie"
                  ? "bg-primary-foreground text-foreground"
                  : "text-primary-foreground hover:text-primary-foreground/80"
              }`}
            >
              Custom Hoodie | هودي مخصص
            </button>
            <button
              onClick={() => setProductType("mug")}
              className={`rounded-full px-6 py-2.5 font-body text-sm font-semibold transition-all ${
                productType === "mug"
                  ? "bg-primary-foreground text-foreground"
                  : "text-primary-foreground hover:text-primary-foreground/80"
              }`}
            >
              Custom Mug | كوب مخصص
            </button>
          </div>
        </div>

        {/* Designer Container */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Preview Panel */}
          <div className="order-2 lg:order-1">
            <div 
              className="relative flex aspect-square items-center justify-center rounded-2xl transition-colors duration-300"
              style={{ backgroundColor: selectedColorData?.hex === "#000000" ? "#1a1a1a" : selectedColorData?.hex || "#fff" }}
            >
              {/* Design Side Toggle */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={() => setDesignSide("front")}
                  className={`rounded-lg px-4 py-2 font-body text-xs font-semibold transition-all ${
                    designSide === "front"
                      ? "bg-foreground text-primary-foreground"
                      : "bg-primary-foreground/20 text-foreground hover:bg-primary-foreground/30"
                  }`}
                >
                  Front | الواجهة
                </button>
                <button
                  onClick={() => setDesignSide("back")}
                  className={`rounded-lg px-4 py-2 font-body text-xs font-semibold transition-all ${
                    designSide === "back"
                      ? "bg-foreground text-primary-foreground"
                      : "bg-primary-foreground/20 text-foreground hover:bg-primary-foreground/30"
                  }`}
                >
                  Back | الخلف
                </button>
              </div>

              {/* Product Preview */}
              <div className="relative flex h-full w-full items-center justify-center p-16">
                {productType === "hoodie" ? (
                  <HoodiePreview color={selectedColorData?.hex || "#000"} side={designSide} />
                ) : (
                  <MugPreview />
                )}
                
                {/* Design Area Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1/3 w-1/3 border-2 border-dashed border-foreground/20 rounded-lg flex items-center justify-center">
                    {uploadedImages === 0 && (
                      <span className="font-body text-xs text-foreground/40 text-center px-4">
                        تصميمك هنا
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="order-1 flex flex-col gap-8 lg:order-2">
            {/* Upload Area */}
            <div>
              <label className="mb-3 flex items-center gap-2 font-body text-sm font-semibold text-primary-foreground">
                <Upload size={16} />
                Upload Image | ارفع صورة
              </label>
              <div className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-primary-foreground/30 bg-primary-foreground/5 p-8 transition-all duration-300 hover:border-accent hover:bg-primary-foreground/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Upload className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <span className="block font-body text-sm font-semibold text-primary-foreground">
                    اسحب الملف هنا أو انقر للرفع
                  </span>
                  <span className="font-body text-xs text-primary-foreground/60">
                    PNG, JPG up to 10MB
                  </span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {productType === "hoodie" && (
              <div>
                <label className="mb-3 flex items-center gap-2 font-body text-sm font-semibold text-primary-foreground">
                  <Palette size={16} />
                  اختر اللون
                </label>
                <div className="flex flex-wrap gap-3">
                  {hoodieColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        selectedColor === color.id
                          ? "border-accent scale-110 shadow-lg"
                          : "border-primary-foreground/20 hover:border-primary-foreground/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {productType === "hoodie" && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="font-body text-sm font-semibold text-primary-foreground">
                    اختر المقاس
                  </label>
                  <button className="font-body text-xs text-accent underline">
                    Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg px-5 py-2.5 font-body text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-primary-foreground text-foreground"
                          : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="mt-auto rounded-xl bg-primary-foreground/10 p-6">
              <h3 className="mb-4 font-sans text-lg font-bold text-primary-foreground">
                ملخص الطلب
              </h3>
              <div className="space-y-2 border-b border-primary-foreground/20 pb-4 mb-4">
                {productType === "hoodie" && (
                  <>
                    <div className="flex justify-between font-body text-sm text-primary-foreground/80">
                      <span>Color</span>
                      <span>{selectedColorData?.name}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-primary-foreground/80">
                      <span>Size</span>
                      <span>{selectedSize}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-body text-sm text-primary-foreground/80">
                  <span>Designs</span>
                  <span>{uploadedImages} images</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-body text-sm text-primary-foreground/80">السعر</span>
                <span className="font-sans text-3xl font-black text-primary-foreground">
                  {price} JD
                </span>
              </div>
              <button className="w-full rounded-full bg-primary-foreground py-4 font-body text-base font-semibold text-foreground transition-all hover:scale-[1.02] hover:shadow-lg">
                Place Order | اطلب الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HoodiePreview({ color, side }: { color: string; side: DesignSide }) {
  const strokeColor = color === "#000000" || color === "#1E3A5F" || color === "#166534" || color === "#7F1D1D" ? "#ffffff" : "#000000"
  
  return (
    <svg width="200" height="260" viewBox="0 0 200 260" fill="none" className="opacity-30">
      <path 
        d="M60 50 Q100 20 140 50 Q145 60 140 75 L60 75 Q55 60 60 50" 
        stroke={strokeColor} 
        strokeWidth="2" 
        fill="none" 
      />
      <path 
        d="M40 75 L60 75 L60 220 L140 220 L140 75 L160 75 L160 240 L40 240 Z" 
        stroke={strokeColor} 
        strokeWidth="2" 
        fill="none" 
      />
      <path 
        d="M40 75 L15 140 L35 148 L55 90" 
        stroke={strokeColor} 
        strokeWidth="2" 
        fill="none" 
      />
      <path 
        d="M160 75 L185 140 L165 148 L145 90" 
        stroke={strokeColor} 
        strokeWidth="2" 
        fill="none" 
      />
      {side === "front" && (
        <path 
          d="M75 160 L125 160 L125 195 L75 195 Z" 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          fill="none" 
          strokeDasharray="4 2"
        />
      )}
    </svg>
  )
}

function MugPreview() {
  return (
    <svg width="160" height="180" viewBox="0 0 160 180" fill="none" className="opacity-30">
      <ellipse cx="70" cy="35" rx="55" ry="12" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary-foreground" />
      <path d="M15 35 L15 145 Q15 165 70 165 Q125 165 125 145 L125 35" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary-foreground" />
      <path d="M125 55 Q155 55 155 95 Q155 135 125 135" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary-foreground" />
    </svg>
  )
}
