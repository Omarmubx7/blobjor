"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { 
  PRODUCT_CONFIGS, 
  getMockupPhotoPath, 
  hasMockupPhoto,
  calculatePrintAreaPixels,
  type ProductMockupConfig 
} from "@/lib/mockup-config"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface DesignElement {
  id: string
  type: "image" | "text"
  url?: string
  text?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation?: number
  fontSize?: number
  fontFamily?: string
  color?: string
  stroke?: boolean
  strokeColor?: string
  strokeWidth?: number
  side: "front" | "back"
}

interface RealisticPreviewProps {
  productType: string
  colorId: string
  viewId: string
  designElements: DesignElement[]
  fabricCanvas?: unknown // Accept any fabric canvas type
  className?: string
  quality?: "preview" | "export" // preview = fast, export = high quality
}

export function RealisticPreview({
  productType,
  colorId,
  viewId,
  designElements,
  fabricCanvas,
  className,
  quality = "preview"
}: RealisticPreviewProps) {
  const compositeCanvasRef = useRef<HTMLCanvasElement>(null)
  const [mockupUrl, setMockupUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const config = PRODUCT_CONFIGS[productType]

  // Generate realistic mockup
  const generateMockup = useCallback(async () => {
    if (!compositeCanvasRef.current || !config) return

    setIsGenerating(true)
    setError(null)

    const canvas = compositeCanvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const view = config.views.find(v => v.id === viewId)
    if (!view) return

    // Set canvas size based on quality
    const scale = quality === "export" ? 3 : 1.5
    canvas.width = config.canvasSize.width * scale
    canvas.height = config.canvasSize.height * scale

    try {
      // Check if we have a real product photo
      const photoAvailable = hasMockupPhoto(productType, colorId)
      setHasPhoto(photoAvailable)

      if (photoAvailable) {
        // Method 1: Use real product photography
        await generateWithRealPhoto(ctx, canvas, config, view, colorId, designElements)
      } else {
        // Method 2: Generate synthetic mockup (current approach)
        await generateSyntheticMockup(ctx, canvas, config, view, colorId, designElements, fabricCanvas)
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png", quality === "export" ? 0.95 : 0.8)
      setMockupUrl(dataUrl)

    } catch (err) {
      console.error("Mockup generation failed:", err)
      setError("فشل في إنشاء المعاينة")
      
      // Fallback: use fabric canvas export directly
      if (fabricCanvas && typeof (fabricCanvas as { toDataURL?: unknown }).toDataURL === "function") {
        try {
          const fc = fabricCanvas as { toDataURL: (opts: { format: string; quality: number; multiplier: number }) => string }
          const fallbackUrl = fc.toDataURL({
            format: "png",
            quality: 0.9,
            multiplier: scale
          })
          setMockupUrl(fallbackUrl)
        } catch {
          // Silent fail
        }
      }
    } finally {
      setIsGenerating(false)
    }
  }, [productType, colorId, viewId, designElements, fabricCanvas, config, quality])

  // Debounced generation
  useEffect(() => {
    const timeout = setTimeout(generateMockup, 150)
    return () => clearTimeout(timeout)
  }, [generateMockup])

  return (
    <div className={cn(
      "relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden",
      className
    )}>
      {/* Hidden canvas for compositing */}
      <canvas
        ref={compositeCanvasRef}
        style={{ display: "none" }}
        className="realistic-preview-export-canvas"
      />

      {/* Loading overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Spinner className="w-8 h-8" />
            <p className="text-sm text-gray-600">جارٍ إنشاء المعاينة...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Mockup display */}
      {mockupUrl && (
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            src={mockupUrl}
            alt="معاينة المنتج"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          
          {/* Photo indicator */}
          {hasPhoto && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              ✓ صورة واقعية
            </div>
          )}
        </div>
      )}

      {/* No mockup placeholder */}
      {!mockupUrl && !isGenerating && !error && (
        <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
          <p>ابدأ التصميم لرؤية المعاينة</p>
        </div>
      )}
    </div>
  )
}

/**
 * Generate mockup using real product photography
 */
async function generateWithRealPhoto(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: ProductMockupConfig,
  view: ProductMockupConfig["views"][0],
  colorId: string,
  designElements: DesignElement[]
): Promise<void> {
  const photoPath = getMockupPhotoPath(config.id, colorId, view.id)
  
  // Load product photo
  const productPhoto = await loadImage(photoPath)
  ctx.drawImage(productPhoto, 0, 0, canvas.width, canvas.height)

  // Calculate print area in pixels
  const printArea = calculatePrintAreaPixels(
    view.printArea,
    canvas.width,
    canvas.height
  )

  // Create design layer
  const designCanvas = document.createElement("canvas")
  designCanvas.width = printArea.width
  designCanvas.height = printArea.height
  const designCtx = designCanvas.getContext("2d")
  if (!designCtx) return

  // Render design elements
  for (const element of designElements.filter(e => e.side === view.id)) {
    await renderElement(designCtx, element, printArea)
  }

  // Apply design to product with realistic blending
  ctx.save()
  
  // Position at print area
  ctx.translate(printArea.x, printArea.y)
  
  // Apply multiply blend for realistic fabric integration
  ctx.globalCompositeOperation = "multiply"
  ctx.globalAlpha = 0.95
  ctx.drawImage(designCanvas, 0, 0)
  
  ctx.restore()

  // Add fabric texture overlay
  await addFabricTexture(ctx, canvas, config.id)
}

/**
 * Generate synthetic mockup (no product photo available)
 */
async function generateSyntheticMockup(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: ProductMockupConfig,
  view: ProductMockupConfig["views"][0],
  colorId: string,
  designElements: DesignElement[],
  fabricCanvas?: unknown
): Promise<void> {
  const color = config.colors.find(c => c.id === colorId)
  const productColor = color?.hex || "#FFFFFF"

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw product shape based on type
  if (config.id === "hoodie") {
    drawHoodieShape(ctx, canvas, productColor)
  } else if (config.id === "mug") {
    drawMugShape(ctx, canvas, productColor)
  } else {
    // Generic rectangle
    ctx.fillStyle = productColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Calculate print area
  const printArea = calculatePrintAreaPixels(
    view.printArea,
    canvas.width,
    canvas.height
  )

  // Draw print area guide (subtle)
  ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.strokeRect(printArea.x, printArea.y, printArea.width, printArea.height)
  ctx.setLineDash([])

  // If we have a fabric canvas, use its export
  let designDrawn = false

  // Prefer fabric export when available and healthy
  if (
    fabricCanvas &&
    typeof (fabricCanvas as { toDataURL?: unknown }).toDataURL === "function" &&
    // Guard against disposed/partial canvas objects that break toDataURL
    (fabricCanvas as any).lowerCanvasEl &&
    (fabricCanvas as any).contextContainer
  ) {
    try {
      const fc = fabricCanvas as { toDataURL: (opts: { format: string; quality: number; multiplier: number }) => string }
      const designDataUrl = fc.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2
      })
      
      const designImg = await loadImage(designDataUrl)
      
      // Draw design in print area with proper scaling
      const aspectRatio = designImg.width / designImg.height
      let drawWidth = printArea.width
      let drawHeight = printArea.height
      
      if (aspectRatio > printArea.width / printArea.height) {
        drawHeight = drawWidth / aspectRatio
      } else {
        drawWidth = drawHeight * aspectRatio
      }
      
      const drawX = printArea.x + (printArea.width - drawWidth) / 2
      const drawY = printArea.y + (printArea.height - drawHeight) / 2
      
      ctx.drawImage(designImg, drawX, drawY, drawWidth, drawHeight)
      designDrawn = true
    } catch (err) {
      console.error("Failed to export fabric canvas:", err)
    }
  }

  // Fallback: render from design elements directly when fabric export is unavailable
  if (!designDrawn && designElements.length) {
    const designCanvas = document.createElement("canvas")
    designCanvas.width = printArea.width
    designCanvas.height = printArea.height
    const designCtx = designCanvas.getContext("2d")
    if (designCtx) {
      for (const element of designElements.filter(e => e.side === view.id)) {
        await renderElement(designCtx, element, printArea)
      }

      const drawX = printArea.x
      const drawY = printArea.y
      ctx.drawImage(designCanvas, drawX, drawY)
    }
  }

  // Add subtle shadow and highlights for 3D effect
  addProductShading(ctx, canvas, config.id)
}

/**
 * Draw hoodie shape
 */
function drawHoodieShape(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  const w = canvas.width
  const h = canvas.height
  
  ctx.fillStyle = color
  
  // Main body
  ctx.beginPath()
  ctx.moveTo(w * 0.1, h * 0.2)  // Left shoulder
  ctx.lineTo(w * 0.0, h * 0.35)  // Left sleeve
  ctx.lineTo(w * 0.0, h * 0.55)  // Left sleeve bottom
  ctx.lineTo(w * 0.15, h * 0.45) // Armpit
  ctx.lineTo(w * 0.15, h * 0.95) // Bottom left
  ctx.lineTo(w * 0.85, h * 0.95) // Bottom right
  ctx.lineTo(w * 0.85, h * 0.45) // Right armpit
  ctx.lineTo(w * 1.0, h * 0.55)  // Right sleeve bottom
  ctx.lineTo(w * 1.0, h * 0.35)  // Right sleeve
  ctx.lineTo(w * 0.9, h * 0.2)   // Right shoulder
  ctx.quadraticCurveTo(w * 0.5, h * 0.1, w * 0.1, h * 0.2) // Neckline/hood
  ctx.closePath()
  ctx.fill()

  // Hood outline
  ctx.strokeStyle = adjustColor(color, -20)
  ctx.lineWidth = 2
  ctx.stroke()
}

/**
 * Draw mug shape
 */
function drawMugShape(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  const w = canvas.width
  const h = canvas.height
  const centerX = w * 0.45
  const centerY = h * 0.5

  // Main body (cylinder)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(centerX, h * 0.15, w * 0.28, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Body rectangle
  ctx.fillRect(centerX - w * 0.28, h * 0.15, w * 0.56, h * 0.7)
  
  // Bottom ellipse
  ctx.beginPath()
  ctx.ellipse(centerX, h * 0.85, w * 0.28, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()

  // Handle
  ctx.strokeStyle = color
  ctx.lineWidth = w * 0.05
  ctx.beginPath()
  ctx.arc(w * 0.82, centerY, h * 0.18, -Math.PI * 0.4, Math.PI * 0.4)
  ctx.stroke()

  // Inner shadow for depth
  ctx.fillStyle = adjustColor(color, -30)
  ctx.beginPath()
  ctx.ellipse(centerX, h * 0.15, w * 0.22, h * 0.04, 0, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Add product shading for 3D effect
 */
function addProductShading(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  productType: string
): void {
  // Radial gradient for depth
  const gradient = ctx.createRadialGradient(
    canvas.width * 0.3,
    canvas.height * 0.3,
    0,
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.7
  )
  
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
  gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)")
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.15)")
  
  ctx.fillStyle = gradient
  ctx.globalCompositeOperation = "overlay"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = "source-over"
}

/**
 * Add fabric texture overlay
 */
async function addFabricTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  productType: string
): Promise<void> {
  // Create noise pattern for fabric texture
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10
    data[i] = Math.max(0, Math.min(255, data[i] + noise))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
  }
  
  ctx.putImageData(imageData, 0, 0)
}

/**
 * Render a single design element
 */
async function renderElement(
  ctx: CanvasRenderingContext2D,
  element: DesignElement,
  printArea: { x: number; y: number; width: number; height: number }
): Promise<void> {
  // Scale position to print area
  const scaleX = printArea.width / 400 // Assuming 400px design canvas
  const scaleY = printArea.height / 480

  if (element.type === "image" && element.url) {
    const img = await loadImage(element.url)
    
    ctx.save()
    ctx.translate(element.position.x * scaleX, element.position.y * scaleY)
    ctx.rotate(((element.rotation || 0) * Math.PI) / 180)
    
    ctx.drawImage(
      img,
      (-element.size.width * scaleX) / 2,
      (-element.size.height * scaleY) / 2,
      element.size.width * scaleX,
      element.size.height * scaleY
    )
    
    ctx.restore()
  } else if (element.type === "text" && element.text) {
    ctx.save()
    ctx.font = `${(element.fontSize || 24) * scaleX}px ${element.fontFamily || "Arial"}`
    ctx.fillStyle = element.color || "#000000"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    
    if (element.stroke) {
      ctx.strokeStyle = element.strokeColor || "#FFFFFF"
      ctx.lineWidth = (element.strokeWidth || 2) * scaleX
      ctx.strokeText(element.text, element.position.x * scaleX, element.position.y * scaleY)
    }
    
    ctx.fillText(element.text, element.position.x * scaleX, element.position.y * scaleY)
    ctx.restore()
  }
}

/**
 * Helper to load images
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/**
 * Adjust color brightness
 */
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

export default RealisticPreview
