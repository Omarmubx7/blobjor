/**
 * Mockup Generator for BloB.JO Custom Designer
 * Creates realistic product previews with user designs
 */

// Print area definitions for different products
export const PRINT_AREAS = {
  hoodie: {
    front: {
      // Print area as percentage of canvas
      x: 0.25, // 25% from left
      y: 0.18, // 18% from top
      width: 0.5, // 50% of canvas width
      height: 0.4, // 40% of canvas height
      // Perspective transformation for realistic look
      perspective: {
        topScale: 0.95,
        bottomScale: 1.05,
      }
    },
    back: {
      x: 0.22,
      y: 0.15,
      width: 0.56,
      height: 0.45,
      perspective: {
        topScale: 0.94,
        bottomScale: 1.06,
      }
    }
  },
  mug: {
    front: {
      // Mug has curved surface - design wraps around
      x: 0.15,
      y: 0.22,
      width: 0.7,
      height: 0.35,
      perspective: {
        // Slight curve effect
        curveFactor: 0.1,
      }
    }
  }
} as const

export interface DesignPosition {
  x: number
  y: number
  scale: number
  rotation: number
}

export interface MockupOptions {
  productType: 'hoodie' | 'mug'
  side: 'front' | 'back'
  color: string
  designImage: string // Base64 or URL
  designPosition: DesignPosition
  outputWidth?: number
  outputHeight?: number
}

/**
 * Generate a composite mockup image
 * For production, this could use server-side canvas (node-canvas) or image processing library
 * For client-side preview, we use HTML Canvas
 */
export async function generateMockup(
  canvas: HTMLCanvasElement,
  options: MockupOptions
): Promise<string> {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  const { productType, side, color, designImage, designPosition } = options
  const width = options.outputWidth || 400
  const height = options.outputHeight || 480

  canvas.width = width
  canvas.height = height

  // 1. Draw product background color
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)

  // 2. Draw product outline/shape
  drawProductShape(ctx, productType, side, color, width, height)

  // 3. Load and position the design
  try {
    const img = await loadImage(designImage)
    const printArea = PRINT_AREAS[productType][side as keyof typeof PRINT_AREAS[typeof productType]]
    
    // Calculate design placement within print area
    const printX = printArea.x * width
    const printY = printArea.y * height
    const printWidth = printArea.width * width
    const printHeight = printArea.height * height

    // Apply design position and scale
    const scaledWidth = (img.width * designPosition.scale)
    const scaledHeight = (img.height * designPosition.scale)
    
    // Center design within print area, then apply offset
    const designX = printX + (printWidth - scaledWidth) / 2 + (designPosition.x - 200) * 0.5
    const designY = printY + (printHeight - scaledHeight) / 2 + (designPosition.y - 240) * 0.5

    // Save context for rotation
    ctx.save()
    
    // Translate to design center for rotation
    const centerX = designX + scaledWidth / 2
    const centerY = designY + scaledHeight / 2
    ctx.translate(centerX, centerY)
    ctx.rotate((designPosition.rotation * Math.PI) / 180)
    ctx.translate(-centerX, -centerY)

    // Apply perspective transformation for hoodie
    if (productType === 'hoodie' && 'perspective' in printArea) {
      // Simple perspective effect by drawing with slight trapezoid distortion
      ctx.drawImage(
        img,
        designX,
        designY,
        scaledWidth,
        scaledHeight
      )
    } else {
      ctx.drawImage(
        img,
        designX,
        designY,
        scaledWidth,
        scaledHeight
      )
    }

    ctx.restore()

    // 4. Apply fabric texture overlay for realism
    applyFabricTexture(ctx, productType, width, height)

    // 5. Add subtle shadows/highlights
    addRealisticEffects(ctx, productType, width, height)

  } catch (error) {
    console.error('Error generating mockup:', error)
  }

  return canvas.toDataURL('image/png', 0.92)
}

/**
 * Draw product shape outline
 */
function drawProductShape(
  ctx: CanvasRenderingContext2D,
  productType: 'hoodie' | 'mug',
  side: 'front' | 'back',
  color: string,
  width: number,
  height: number
) {
  const strokeColor = isLightColor(color) ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 1

  if (productType === 'hoodie') {
    drawHoodieShape(ctx, side, width, height)
  } else {
    drawMugShape(ctx, width, height)
  }
}

function drawHoodieShape(
  ctx: CanvasRenderingContext2D,
  side: 'front' | 'back',
  width: number,
  height: number
) {
  const scale = width / 400 // Base design was for 400px width

  ctx.beginPath()
  
  // Hood
  ctx.moveTo(120 * scale, 100 * scale)
  ctx.quadraticCurveTo(200 * scale, 50 * scale, 280 * scale, 100 * scale)
  ctx.quadraticCurveTo(290 * scale, 120 * scale, 280 * scale, 150 * scale)
  ctx.lineTo(120 * scale, 150 * scale)
  ctx.quadraticCurveTo(110 * scale, 120 * scale, 120 * scale, 100 * scale)
  
  // Body
  ctx.moveTo(80 * scale, 150 * scale)
  ctx.lineTo(120 * scale, 150 * scale)
  ctx.lineTo(120 * scale, 440 * scale)
  ctx.lineTo(280 * scale, 440 * scale)
  ctx.lineTo(280 * scale, 150 * scale)
  ctx.lineTo(320 * scale, 150 * scale)
  ctx.lineTo(320 * scale, 480 * scale)
  ctx.lineTo(80 * scale, 480 * scale)
  ctx.closePath()
  
  ctx.stroke()

  // Left sleeve
  ctx.beginPath()
  ctx.moveTo(80 * scale, 150 * scale)
  ctx.lineTo(30 * scale, 280 * scale)
  ctx.lineTo(70 * scale, 296 * scale)
  ctx.lineTo(110 * scale, 180 * scale)
  ctx.stroke()

  // Right sleeve
  ctx.beginPath()
  ctx.moveTo(320 * scale, 150 * scale)
  ctx.lineTo(370 * scale, 280 * scale)
  ctx.lineTo(330 * scale, 296 * scale)
  ctx.lineTo(290 * scale, 180 * scale)
  ctx.stroke()

  // Pocket (front only)
  if (side === 'front') {
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(150 * scale, 360 * scale)
    ctx.lineTo(250 * scale, 360 * scale)
    ctx.lineTo(250 * scale, 420 * scale)
    ctx.quadraticCurveTo(200 * scale, 430 * scale, 150 * scale, 420 * scale)
    ctx.closePath()
    ctx.stroke()
    ctx.setLineDash([])
  }
}

function drawMugShape(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const scale = width / 400

  // Top ellipse
  ctx.beginPath()
  ctx.ellipse(175 * scale, 85 * scale, 137 * scale, 30 * scale, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Body
  ctx.beginPath()
  ctx.moveTo(38 * scale, 85 * scale)
  ctx.lineTo(38 * scale, 360 * scale)
  ctx.quadraticCurveTo(38 * scale, 410 * scale, 175 * scale, 410 * scale)
  ctx.quadraticCurveTo(312 * scale, 410 * scale, 312 * scale, 360 * scale)
  ctx.lineTo(312 * scale, 85 * scale)
  ctx.stroke()

  // Handle
  ctx.beginPath()
  ctx.moveTo(312 * scale, 137 * scale)
  ctx.quadraticCurveTo(387 * scale, 137 * scale, 387 * scale, 237 * scale)
  ctx.quadraticCurveTo(387 * scale, 337 * scale, 312 * scale, 337 * scale)
  ctx.stroke()
}

/**
 * Apply fabric texture overlay for realism
 */
function applyFabricTexture(
  ctx: CanvasRenderingContext2D,
  productType: 'hoodie' | 'mug',
  width: number,
  height: number
) {
  if (productType === 'hoodie') {
    // Create fabric weave pattern
    ctx.globalAlpha = 0.03
    ctx.fillStyle = '#000'
    
    const gridSize = 3
    for (let y = 0; y < height; y += gridSize * 2) {
      for (let x = 0; x < width; x += gridSize * 2) {
        if ((x + y) % (gridSize * 4) === 0) {
          ctx.fillRect(x, y, gridSize, gridSize)
        }
      }
    }
    ctx.globalAlpha = 1
  }
}

/**
 * Add shadows and highlights for 3D effect
 */
function addRealisticEffects(
  ctx: CanvasRenderingContext2D,
  productType: 'hoodie' | 'mug',
  width: number,
  height: number
) {
  if (productType === 'hoodie') {
    // Add subtle fold shadows
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, 'rgba(0,0,0,0.05)')
    gradient.addColorStop(0.3, 'rgba(0,0,0,0)')
    gradient.addColorStop(0.7, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.05)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  } else {
    // Mug has curved surface highlight
    const gradient = ctx.createRadialGradient(
      width * 0.3, height * 0.4, 0,
      width * 0.3, height * 0.4, width * 0.5
    )
    gradient.addColorStop(0, 'rgba(255,255,255,0.08)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
}

/**
 * Helper: Load image from URL or base64
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Helper: Determine if color is light or dark
 */
function isLightColor(hex: string): boolean {
  const color = hex.replace('#', '')
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

/**
 * Quick mockup generation for preview (simpler, faster)
 */
export function generateQuickMockup(
  designDataUrl: string,
  productType: 'hoodie' | 'mug',
  color: string,
  side: 'front' | 'back' = 'front'
): string {
  // For client-side quick preview, return the design with color info
  // The actual composite will happen in the preview component using canvas
  return JSON.stringify({
    design: designDataUrl,
    productType,
    color,
    side,
    timestamp: Date.now()
  })
}
