/**
 * Product Mockup Configuration - CustomInk Style
 * Defines print areas, product photos, and rendering settings
 */

export interface PrintArea {
  x: number      // X position as percentage (0-1)
  y: number      // Y position as percentage (0-1)
  width: number  // Width as percentage (0-1)
  height: number // Height as percentage (0-1)
  rotation?: number
}

export interface ProductView {
  id: string
  label: string
  labelAr: string
  icon: string
  printArea: PrintArea
  hasPhoto: boolean
}

export interface ProductColor {
  id: string
  name: string
  nameAr: string
  hex: string
  photoAvailable: boolean
}

export interface ProductMockupConfig {
  id: string
  name: string
  nameAr: string
  basePrice: number
  views: ProductView[]
  colors: ProductColor[]
  canvasSize: { width: number; height: number }
  printResolution: number // DPI for print files
}

// Hoodie Configuration
export const HOODIE_CONFIG: ProductMockupConfig = {
  id: "hoodie",
  name: "Hoodie",
  nameAr: "هودي",
  basePrice: 12,
  canvasSize: { width: 400, height: 480 },
  printResolution: 300,
  views: [
    {
      id: "front",
      label: "Front",
      labelAr: "أمام",
      icon: "👕",
      printArea: {
        x: 0.22,    // 22% from left
        y: 0.25,    // 25% from top
        width: 0.56, // 56% width
        height: 0.40 // 40% height
      },
      hasPhoto: true
    },
    {
      id: "back",
      label: "Back",
      labelAr: "خلف",
      icon: "🔙",
      printArea: {
        x: 0.20,
        y: 0.18,
        width: 0.60,
        height: 0.50
      },
      hasPhoto: true
    }
  ],
  colors: [
    { id: "black", name: "Black", nameAr: "أسود", hex: "#1a1a1a", photoAvailable: false },
    { id: "white", name: "White", nameAr: "أبيض", hex: "#FFFFFF", photoAvailable: false },
    { id: "heather-grey", name: "Heather Grey", nameAr: "رمادي فاتح", hex: "#9CA3AF", photoAvailable: false },
    { id: "navy", name: "Navy", nameAr: "كحلي", hex: "#1E3A5F", photoAvailable: false },
    { id: "royal-blue", name: "Royal Blue", nameAr: "أزرق ملكي", hex: "#1D4ED8", photoAvailable: false },
    { id: "forest-green", name: "Forest Green", nameAr: "أخضر غامق", hex: "#166534", photoAvailable: false },
    { id: "maroon", name: "Maroon", nameAr: "عنابي", hex: "#7F1D1D", photoAvailable: false },
    { id: "purple", name: "Purple", nameAr: "بنفسجي", hex: "#7C3AED", photoAvailable: false },
  ]
}

// Mug Configuration
export const MUG_CONFIG: ProductMockupConfig = {
  id: "mug",
  name: "Mug",
  nameAr: "كوب",
  basePrice: 3,
  canvasSize: { width: 400, height: 400 },
  printResolution: 300,
  views: [
    {
      id: "front",
      label: "Front",
      labelAr: "أمام",
      icon: "☕",
      printArea: {
        x: 0.12,
        y: 0.20,
        width: 0.60,
        height: 0.45
      },
      hasPhoto: true
    }
  ],
  colors: [
    { id: "white", name: "White", nameAr: "أبيض", hex: "#FFFFFF", photoAvailable: false },
    { id: "black", name: "Black", nameAr: "أسود", hex: "#1a1a1a", photoAvailable: false },
  ]
}

export const PRODUCT_CONFIGS: Record<string, ProductMockupConfig> = {
  hoodie: HOODIE_CONFIG,
  mug: MUG_CONFIG
}

/**
 * Get mockup photo path for a product/color/view combination
 */
export function getMockupPhotoPath(
  productType: string,
  colorId: string,
  viewId: string
): string {
  return `/mockups/${productType}/${colorId}-${viewId}.png`
}

/**
 * Get print area mask path
 */
export function getPrintAreaMaskPath(
  productType: string,
  viewId: string
): string {
  return `/mockups/${productType}/masks/${viewId}-print-area.png`
}

/**
 * Check if mockup photo exists for combination
 */
export function hasMockupPhoto(
  productType: string,
  colorId: string
): boolean {
  const config = PRODUCT_CONFIGS[productType]
  if (!config) return false
  const color = config.colors.find(c => c.id === colorId)
  return color?.photoAvailable || false
}

/**
 * Calculate actual pixel dimensions from percentages
 */
export function calculatePrintAreaPixels(
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; width: number; height: number } {
  return {
    x: Math.round(printArea.x * canvasWidth),
    y: Math.round(printArea.y * canvasHeight),
    width: Math.round(printArea.width * canvasWidth),
    height: Math.round(printArea.height * canvasHeight)
  }
}

/**
 * Get print area info for display
 */
export function getPrintAreaInfo(
  productType: string,
  viewId: string
): { inches: string; cm: string; pixels: string } {
  const config = PRODUCT_CONFIGS[productType]
  if (!config) return { inches: "N/A", cm: "N/A", pixels: "N/A" }
  
  const view = config.views.find(v => v.id === viewId)
  if (!view) return { inches: "N/A", cm: "N/A", pixels: "N/A" }
  
  const pixels = calculatePrintAreaPixels(
    view.printArea,
    config.canvasSize.width * 3, // 3x for high DPI
    config.canvasSize.height * 3
  )
  
  // Assuming 300 DPI
  const inchesW = (pixels.width / 300).toFixed(1)
  const inchesH = (pixels.height / 300).toFixed(1)
  const cmW = (pixels.width / 300 * 2.54).toFixed(1)
  const cmH = (pixels.height / 300 * 2.54).toFixed(1)
  
  return {
    inches: `${inchesW}" × ${inchesH}"`,
    cm: `${cmW} × ${cmH} سم`,
    pixels: `${pixels.width} × ${pixels.height}px`
  }
}
