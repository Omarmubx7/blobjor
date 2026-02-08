'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Upload, Type, Layers, ShoppingBag, Download,
  RotateCw, ZoomIn, ZoomOut, Trash2, Maximize2,
  Check, ChevronDown, AlignLeft, AlignCenter, AlignRight,
  Move, X, Undo2, Redo2, Eye, EyeOff, ArrowRight, Copy
} from 'lucide-react'
import * as fabric from 'fabric' // Fabric.js v6+
import { SizeChartModal } from './size-chart-modal'
import { Spinner } from '@/components/ui/spinner'
import { useCart } from '@/contexts/cart-context'


// --- Constants & Data ---

const FONTS = {
  arabic: ['Cairo', 'Amiri', 'Tajawal', 'Noto Naskh Arabic', 'Changa', 'Lateef', 'Reem Kufi', 'Almarai', 'Markazi Text'],
  english: ['Arial', 'Roboto', 'Montserrat', 'Lato', 'Oswald', 'Poppins', 'Open Sans', 'Raleway', 'Bebas Neue', 'Inter']
}

const PRODUCTS = {
  hoodie: {
    id: 'hoodie',
    name: 'هودي',
    price: 12,
    colors: [
      { id: 'purple', hex: '#8B5CF6', name: 'أرجواني', image: '/images/hoodie-purple.png' },
      { id: 'maroon', hex: '#7F1D1D', name: 'أحمر داكن', image: '/images/hoodie-maroon.png' },
      { id: 'olive', hex: '#3F4C3A', name: 'زيتي', image: '/images/hoodie-olive.png' }, // Approximate hex for olive
      { id: 'blue', hex: '#2563EB', name: 'أزرق ملكي', image: '/images/hoodie-blue.png' },
      { id: 'navy', hex: '#1E3A8A', name: 'كحلي', image: '/images/hoodie-navy.png' },
      { id: 'grey', hex: '#9CA3AF', name: 'رمادي', image: '/images/hoodie-grey.png' },
      { id: 'white', hex: '#ffffff', name: 'أبيض', image: '/images/hoodie-white.png' },
      { id: 'black', hex: '#1a1a1a', name: 'أسود', image: '/images/hoodie-black.png' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    printArea: { width: 260, height: 320 } // px
  },
  mug: {
    id: 'mug',
    name: 'كوب',
    price: 3,
    colors: [
      { id: 'white', hex: '#ffffff', name: 'أبيض', image: '/images/mug-white.png' },
      { id: 'black', hex: '#1a1a1a', name: 'أسود', image: '/images/mug-black.png' }
    ],
    sizes: ['One Size'],
    printArea: { width: 140, height: 140 } // px
  }
}

// --- Main Component ---

export default function CustomDesignerPro() {
  // Global State
  const [productType, setProductType] = useState<'hoodie' | 'mug'>('hoodie')
  const [selectedColor, setSelectedColor] = useState('black')
  const [selectedSize, setSelectedSize] = useState('M')
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'layers'>('upload')
  const [isBackView, setIsBackView] = useState(false)
  const [designs, setDesigns] = useState<{ front: any; back: any }>({ front: null, back: null })
  const [sizeChartOpen, setSizeChartOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { addItem, setIsCartOpen } = useCart()

  // Fabric State
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [layers, setLayers] = useState<any[]>([])

  // Tools State
  const [textInput, setTextInput] = useState('')
  const [textLang, setTextLang] = useState<'ar' | 'en'>('ar')
  const [selectedFont, setSelectedFont] = useState(FONTS.arabic[0])
  const [fontSize, setFontSize] = useState(36)
  const [textColor, setTextColor] = useState('#ffffff')

  // Computed
  const currentProduct = PRODUCTS[productType]
  const currentColor = currentProduct.colors.find(c => c.id === selectedColor) || currentProduct.colors[0]
  const currentImage = isBackView
    ? (currentColor.image.replace('.png', '-back.png'))
    : currentColor.image
  const printArea = currentProduct.printArea

  // --- Initialization ---

  // Initialize Fabric
  useEffect(() => {
    if (!canvasRef.current) return

    // Create Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: printArea.width,
      height: printArea.height,
      preserveObjectStacking: true,
      selectionColor: 'rgba(56,189,248,0.3)',
      selectionBorderColor: '#38bdf8',
      selectionLineWidth: 2,
    })

    fabricRef.current = canvas

    // Event Listeners
    const updateSelection = () => {
      const active = canvas.getActiveObject()
      setSelectedObject(active || null)
      // Update layers list
      setLayers([...canvas.getObjects()].reverse().map(obj => ({
        id: (obj as any).id || Math.random().toString(),
        type: obj.type,
        text: (obj as any).text || 'Image',
        visible: obj.visible !== false
      })))
    }

    canvas.on('selection:created', updateSelection)
    canvas.on('selection:updated', updateSelection)
    canvas.on('selection:cleared', () => setSelectedObject(null))
    canvas.on('object:modified', updateSelection)
    canvas.on('object:added', updateSelection)
    canvas.on('object:removed', updateSelection)

    // Sync state with selection
    canvas.on('selection:created', (e) => {
      const active = e.selected?.[0] as any
      if (active && (active.type === 'i-text' || active.type === 'text')) {
        if (active.fontFamily) setSelectedFont(active.fontFamily)
        if (active.fill) setTextColor(active.fill)
        if (active.fontSize) setFontSize(active.fontSize)
      }
    })


    return () => {
      canvas.dispose()
    }
  }, [printArea])

  // Update Canvas Size when product changes
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setDimensions({
        width: printArea.width,
        height: printArea.height
      })
    }
  }, [printArea])

  // Handle Side Switch - Load correct design
  useEffect(() => {
    if (!fabricRef.current) return

    const targetDesign = isBackView ? designs.back : designs.front

    if (targetDesign) {
      fabricRef.current.loadFromJSON(targetDesign, () => {
        fabricRef.current?.requestRenderAll()
        // Re-attach event listeners if needed, or they persist? 
        // Fabric instances persist, but loadFromJSON might need re-setup depending on version. 
        // In v6, it usually works fine.
      })
    } else {
      fabricRef.current.clear()
    }

  }, [isBackView])


  // --- Actions ---

  // Add Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return

    const reader = new FileReader()
    reader.onload = (f) => {
      const data = f.target?.result as string
      // In Fabric 6/7, Image.fromURL might be async or use different signature.
      // Assuming Fabric 6+ pattern:
      fabric.FabricImage.fromURL(data).then((img) => {
        if (!img) return

        // Auto-fit logic
        const scaleX = (printArea.width * 0.9) / img.width!
        const scaleY = (printArea.height * 0.9) / img.height!
        const scale = Math.min(scaleX, scaleY)

        img.scale(scale)
        img.set({
          left: (printArea.width - img.width! * scale) / 2,
          top: (printArea.height - img.height! * scale) / 2,
          cornerColor: '#38bdf8',
          cornerStyle: 'circle',
          borderColor: '#38bdf8',
          transparentCorners: false,
        })

        fabricRef.current!.add(img)
        fabricRef.current!.setActiveObject(img)
        fabricRef.current!.requestRenderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  // Add Text
  const handleAddText = () => {
    if (!textInput || !fabricRef.current) return

    const text = new fabric.IText(textInput, {
      fontFamily: selectedFont,
      fontSize: fontSize,
      fill: textColor,
      left: printArea.width / 2,
      top: printArea.height / 2,
      originX: 'center',
      originY: 'center',
      direction: textLang === 'ar' ? 'rtl' : 'ltr',
      textAlign: textLang === 'ar' ? 'right' : 'left',
      cornerColor: '#38bdf8',
      cornerStyle: 'circle',
      borderColor: '#38bdf8',
      transparentCorners: false,
    })

    fabricRef.current.add(text)
    fabricRef.current.setActiveObject(text)
    fabricRef.current.requestRenderAll()
    setTextInput('')
  }

  // Delete Object
  const handleDelete = () => {
    const active = fabricRef.current?.getActiveObject()
    if (active) {
      fabricRef.current?.remove(active)
      fabricRef.current?.requestRenderAll()
    }
  }

  // Clone
  const handleClone = () => {
    const active = fabricRef.current?.getActiveObject()
    if (active) {
      active.clone().then((cloned: fabric.Object) => {
        fabricRef.current?.add(cloned)
        cloned.set({
          left: active.left! + 20,
          top: active.top! + 20
        })
        fabricRef.current?.setActiveObject(cloned)
        fabricRef.current?.requestRenderAll()
      })
    }
  }

  // --- Export ---

  // --- Export ---

  // Helper: Capture Realistic Preview (Design + Product)
  const captureRealisticPreview = async () => {
    if (!fabricRef.current) return null

    // Create temp canvas for composition
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return null

    // Set high resolution (3x)
    const scale = 3
    // Base dimensions (match the rendered container aspect ratio)
    const baseWidth = productType === 'hoodie' ? 400 : 300
    const baseHeight = productType === 'hoodie' ? 480 : 300

    tempCanvas.width = baseWidth * scale
    tempCanvas.height = baseHeight * scale

    // 1. Draw Product Background
    const productImg = new Image()
    productImg.crossOrigin = 'anonymous'
    productImg.src = currentImage
    await new Promise((resolve, reject) => {
      productImg.onload = resolve
      productImg.onerror = reject
    })

    // Draw product image to fit canvas
    ctx.drawImage(productImg, 0, 0, tempCanvas.width, tempCanvas.height)

    // 2. Draw Design (Print Area)
    const designDataUrl = fabricRef.current.toDataURL({
      format: 'png',
      multiplier: scale,
      enableRetinaScaling: true
    })

    const designImg = new Image()
    designImg.src = designDataUrl
    await new Promise(resolve => {
      designImg.onload = resolve
    })

    // Calculate position of print area on the composite canvas
    // These values must match the CSS positioning in the render:
    // left: 50%, top: 45% -> Center of print area is at 50% X, 45% Y of container
    const printAreaWidth = printArea.width * scale
    const printAreaHeight = printArea.height * scale

    // Center X
    const printAreaX = (tempCanvas.width - printAreaWidth) / 2
    // Center Y at 45%
    const printAreaY = (tempCanvas.height * 0.45) - (printAreaHeight / 2)

    ctx.drawImage(designImg, printAreaX, printAreaY, printAreaWidth, printAreaHeight)

    return tempCanvas.toDataURL('image/png', 1.0)
  }

  // Helper: Capture High-Res Print File (Design Only)
  const capturePrintFile = () => {
    if (!fabricRef.current) return null
    return fabricRef.current.toDataURL({
      format: 'png',
      multiplier: 3,
      enableRetinaScaling: true
    })
  }

  // Helper: Upload to Cloudinary (Client-Side)
  const uploadToCloudinary = async (blob: Blob, folder: string = 'designs'): Promise<string> => {
    // 1. Get Signature & Config from Server
    const timestamp = Math.round((new Date).getTime() / 1000)
    const signParams = {
      timestamp: timestamp,
      folder: `blob-jo/${folder}`,
    }

    const signResponse = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paramsToSign: signParams })
    })

    const { signature, apiKey, cloudName } = await signResponse.json()

    if (!signature || !apiKey || !cloudName) {
      throw new Error('Failed to sign upload request or missing config')
    }

    // 2. Upload
    const formData = new FormData()
    formData.append('file', blob)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('folder', `blob-jo/${folder}`)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    return data.secure_url
  }


  const handleSave = async () => {
    if (!fabricRef.current) return
    setIsProcessing(true)

    try {
      // 1. Capture Images
      const previewDataUrl = await captureRealisticPreview()
      if (!previewDataUrl) throw new Error('Failed to generate preview')
      const previewBlob = await fetch(previewDataUrl).then(r => r.blob())

      const printDataUrl = capturePrintFile()
      if (!printDataUrl) throw new Error('Failed to generate print file')
      const printBlob = await fetch(printDataUrl).then(r => r.blob())

      // 2. Upload to Cloudinary (Client-Side)
      const previewUrl = await uploadToCloudinary(previewBlob, 'designs/previews')
      const printUrl = await uploadToCloudinary(printBlob, 'designs/prints')

      // 3. Collect & Upload Original Images (Assets)
      const objects = fabricRef.current.getObjects()
      const designJsonObjects = []
      const assetUrls = []

      for (const obj of objects) {
        designJsonObjects.push(obj.toObject())

        // If it's an image, upload the original blob
        if (obj.type === 'image') {
          // @ts-ignore
          const src = obj.getSrc ? obj.getSrc() : (obj as any)._element?.src
          if (src && src.startsWith('data:')) {
            const blob = await fetch(src).then(r => r.blob())
            const uploadedAssetUrl = await uploadToCloudinary(blob, 'designs/assets')
            assetUrls.push(uploadedAssetUrl)

            // Update the object src to the cloud URL? 
            // Better to keep local for now, but in DB we might want cloud URL.
            // For now, we just track the uploaded asset URLs.
          } else if (src && src.startsWith('http')) {
            assetUrls.push(src)
          }
        }
      }

      // 4. Send Metadata to API
      const formData = new FormData()
      formData.append('preview_url', previewUrl)
      formData.append('print_url', printUrl)
      formData.append('asset_urls', JSON.stringify(assetUrls))
      formData.append('product_type', productType)
      formData.append('product_color', selectedColor)
      formData.append('price', currentProduct.price.toString())

      formData.append('design_json', JSON.stringify({
        objects: designJsonObjects,
        printArea
      }))

      const response = await fetch('/api/orders/create-design', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Unknown error')
      }

      // 5. Add to Cart
      addItem({
        id: Date.now(),
        title: `${currentProduct.name} - تصميم مخصص`,
        titleAr: `${currentProduct.name} - تصميم مخصص`,
        price: currentProduct.price,
        image: previewUrl,
        size: selectedSize,
        category: productType === 'hoodie' ? 'hoodies' : 'mugs',
        isCustomDesign: true,
        customDesign: {
          designImageUrl: printUrl,
          mockupImageUrl: previewUrl,
          config: {
            position_x: 0,
            position_y: 0,
            scale: 1,
            rotation: 0,
            side: isBackView ? 'back' : 'front',
            canvasJson: { objects: designJsonObjects, printArea },
            assetUrls: assetUrls
          },
          productColor: currentColor.hex,
          notes: 'تصميم مخصص من Design Lab'
        }
      })

      setIsCartOpen(true) // Open cart drawer

    } catch (error) {
      console.error('Save failed:', error)
      alert('حدث خطأ أثناء حفظ التصميم. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsProcessing(false)
    }
  }

  // --- UI Render ---

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-white selection:text-black">

      {/* Font Loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@200..1000&family=Changa:wght@200..800&family=Lateef&family=Markazi+Text:wght@400..700&family=Noto+Naskh+Arabic:wght@400..700&family=Reem+Kufi:wght@400..700&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
      `}</style>

      {/* HEADER */}
      <div className="h-20 border-b border-zinc-800 bg-black flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center justify-center w-10 h-10 border border-zinc-800 hover:bg-white hover:text-black hover:border-white transition-all rounded-sm" title="Back">
            <ArrowRight size={20} />
          </Link>

          <div className="h-8 w-px bg-zinc-800" />

          <h1 className="text-xl font-black uppercase tracking-tighter">
            DESIGN<span className="text-zinc-500">LAB</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="px-6 py-3 border border-zinc-700 hover:border-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download PNG</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Spinner className="w-4 h-4 text-black" /> : <ShoppingBag size={14} />}
            ADD TO CART - {currentProduct.price} JD
          </button>
        </div>
      </div>

      {/* 3-PANEL LAYOUT */}
      <div className="flex-1 overflow-hidden flex flex-col lg:grid lg:grid-cols-[320px_1fr_320px]">

        {/* LEFT PANEL: TOOLS */}
        <aside className="bg-black border-r border-zinc-800 flex flex-col z-20 order-2 lg:order-none h-1/3 lg:h-auto border-t border-zinc-900 lg:border-t-0">
          {/* Tabs - Minimal Text */}
          <div className="flex border-b border-zinc-800">
            {[
              { id: 'upload', label: 'UPLOAD' },
              { id: 'text', label: 'TEXT' },
              { id: 'layers', label: 'LAYERS' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex items-center justify-center relative transition-all ${activeTab === tab.id ? 'text-white bg-zinc-900' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                  }`}
              >
                <span className="text-xs font-black tracking-widest">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />
                )}
              </button>
            ))}
          </div>

          {/* Tools Component */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

            {/* UPLOAD TOOL */}
            {activeTab === 'upload' && (
              <div className="space-y-8">
                <div className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-10 hover:border-white hover:bg-zinc-900 transition-all group text-center cursor-pointer relative rounded-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 bg-black border border-zinc-700 flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:border-white transition-all rounded-sm">
                    <Upload size={20} className="text-zinc-400 group-hover:text-black" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wide mb-1">Upload Image</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase">PNG, JPG (MAX 10MB)</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800 pb-2">Guidelines</p>
                  <ul className="text-[11px] text-zinc-400 space-y-2 list-disc pl-4 font-medium">
                    <li>High resolution images work best.</li>
                    <li>Transparent PNGs are recommended.</li>
                    <li>Avoid copyrighted material.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TEXT TOOL */}
            {activeTab === 'text' && (
              <div className="space-y-6">
                <div className="flex bg-zinc-900 p-1 rounded-sm border border-zinc-800">
                  <button
                    onClick={() => setTextLang('ar')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm ${textLang === 'ar' ? 'bg-black text-white shadow-sm border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Arabic
                  </button>
                  <button
                    onClick={() => setTextLang('en')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm ${textLang === 'en' ? 'bg-black text-white shadow-sm border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    English
                  </button>
                </div>

                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  dir={textLang === 'ar' ? 'rtl' : 'ltr'}
                  placeholder={textLang === 'ar' ? "اكتب النص هنا..." : "Type text here..."}
                  className="w-full bg-black border-2 border-zinc-800 p-4 focus:outline-none focus:border-white focus:ring-0 transition-all min-h-[120px] text-sm font-medium rounded-sm placeholder:text-zinc-600"
                />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Font Family</label>
                    <div className="relative">
                      <select
                        value={selectedFont}
                        onChange={(e) => {
                          const newFont = e.target.value
                          setSelectedFont(newFont)
                          if (fabricRef.current) {
                            const active = fabricRef.current.getActiveObject() as any
                            if (active && (active.type === 'i-text' || active.type === 'text')) {
                              active.set('fontFamily', newFont)
                              fabricRef.current.requestRenderAll()
                            }
                          }
                        }}
                        className="w-full appearance-none bg-black border border-zinc-800 p-3 text-sm focus:outline-none focus:border-white text-white rounded-sm font-bold"
                        style={{ fontFamily: selectedFont }}
                      >
                        <optgroup label="Typefaces">
                          {(textLang === 'ar' ? FONTS.arabic : FONTS.english).map(font => (
                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                          ))}
                        </optgroup>
                      </select>
                      <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Size</label>
                      <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-center focus:border-white outline-none rounded-sm font-bold"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Color</label>
                      <div className="relative h-[46px] overflow-hidden border border-zinc-800 rounded-sm">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                  className="w-full py-4 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-black uppercase tracking-widest transition-all text-xs rounded-sm"
                >
                  ADD TEXT LAYER
                </button>
              </div>
            )}

            {/* LAYERS TOOL */}
            {activeTab === 'layers' && (
              <div className="space-y-4">
                {layers.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-sm">
                    <Layers size={24} className="mx-auto text-zinc-700 mb-2" />
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">No Layers</p>
                  </div>
                ) : (
                  layers.map((layer, index) => (
                    <div key={layer.id} className="bg-zinc-900 border border-zinc-800 p-3 flex items-center gap-3 group hover:border-zinc-600 transition-colors rounded-sm">
                      <div className="w-8 h-8 bg-black border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                        {layer.type === 'i-text' ? 'Aa' : 'IMG'}
                      </div>
                      <span className="flex-1 truncate text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{layer.text}</span>
                      <button className="text-zinc-600 hover:text-red-500 p-2 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER PANEL: CANVAS */}
        <main className="relative bg-zinc-950 flex items-center justify-center p-4 lg:p-10 perspective-1000 overflow-hidden order-1 lg:order-none flex-1">
          {/* Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black border border-zinc-800 rounded-sm px-2 py-2 flex items-center gap-1 z-30 shadow-xl">
            <button className="p-2 hover:bg-zinc-900 rounded-sm text-zinc-400 hover:text-white transition-colors" onClick={handleClone} title="Clone">
              <CopyIcon size={16} />
            </button>
            <div className="w-px h-4 bg-zinc-800 mx-1" />
            <button className="p-2 hover:bg-red-900/50 hover:text-red-500 rounded-sm text-zinc-400 transition-colors" onClick={handleDelete} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
            <div
              className="relative shadow-2xl transition-all duration-500"
              style={{
                width: productType === 'hoodie' ? '400px' : '300px',
                height: productType === 'hoodie' ? '480px' : '300px',
              }}
            >
              {/* Product Image Background */}
              <img
                src={currentImage}
                onError={(e) => {
                  // Fallback if back image doesn't exist yet
                  if (isBackView) {
                    e.currentTarget.src = currentColor.image
                    e.currentTarget.style.transform = "scaleX(-1)"
                  }
                }}
                alt="Product"
                className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none drop-shadow-2xl"
              />

              {/* Print Area Overlay + Canvas */}
              <div
                className="absolute z-10 border border-dashed border-zinc-500/30 hover:border-white/50 transition-colors"
                style={{
                  width: printArea.width,
                  height: printArea.height,
                  left: '50%',
                  top: '45%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <canvas ref={canvasRef} />
              </div>
            </div>
          </div>

          {/* Zoom/Pan Controls */}
          <div className="absolute bottom-8 left-8 flex flex-col gap-2">
            <div className="bg-black border border-zinc-800 p-1 rounded-sm flex flex-col gap-1">
              <button className="p-2 hover:bg-zinc-900 rounded-sm text-zinc-500 hover:text-white transition-colors"><ZoomIn size={18} /></button>
              <button className="p-2 hover:bg-zinc-900 rounded-sm text-zinc-500 hover:text-white transition-colors"><ZoomOut size={18} /></button>
              <button className="p-2 hover:bg-zinc-900 rounded-sm text-zinc-500 hover:text-white transition-colors"><Maximize2 size={18} /></button>
            </div>
          </div>


          {/* View Toggle (Front/Back) */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
            <button
              onClick={() => {
                if (!fabricRef.current) return
                // Save current side
                const json = fabricRef.current.toJSON()
                setDesigns(prev => ({
                  ...prev,
                  [isBackView ? 'back' : 'front']: json
                }))

                // Switch side
                setIsBackView(!isBackView)

                // Clear canvas immediately to avoid flash of wrong design
                fabricRef.current.clear()
              }}
              className="bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all shadow-xl flex items-center gap-2"
            >
              <RotateCw size={16} />
              {isBackView ? 'Show Front' : 'Show Back'}
            </button>
          </div>
        </main>

        {/* RIGHT PANEL: PRODUCT OPTIONS */}
        <aside className="bg-black border-l border-zinc-800 flex flex-col z-20 order-3 lg:order-none h-auto lg:h-full border-t border-zinc-900 lg:border-t-0 pb-20 lg:pb-6">

          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-white font-black text-lg uppercase tracking-tight">Configuration</h2>
            <p className="text-zinc-500 text-xs mt-1">Select your product base</p>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-8">
            {/* Product Info */}
            <div>
              <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Product Type</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(PRODUCTS).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProductType(p.id as any)}
                    className={`p-4 border transition-all flex flex-col items-center gap-3 rounded-sm ${productType === p.id
                      ? 'bg-white border-white text-black'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                  >
                    <span className="text-2xl">{p.id === 'hoodie' ? '🧥' : '☕'}</span>
                    <span className="font-bold text-xs uppercase tracking-wider">{p.name}</span>
                    <span className={`text-[10px] font-mono ${productType === p.id ? 'text-zinc-600' : 'text-zinc-600'}`}>{p.price} JD</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Base Color</h2>
              <div className="flex flex-wrap gap-3">
                {currentProduct.colors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-10 h-10 rounded-full border-2 transition-all relative flex items-center justify-center ${selectedColor === c.id
                      ? 'border-white scale-110'
                      : 'border-zinc-800 hover:scale-105'
                      }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.id && <Check size={14} className={c.id === 'white' ? 'text-black' : 'text-white'} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes (Hoodie Only) */}
            {productType === 'hoodie' && (
              <div>
                <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Size</h2>
                <div className="grid grid-cols-4 gap-2">
                  {currentProduct.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 text-xs font-bold transition-all rounded-sm border ${selectedSize === s
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Size Chart Button */}
                <button
                  onClick={() => setSizeChartOpen(true)}
                  className="mt-6 w-full py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white border-b border-zinc-800 hover:border-white transition-all flex items-center justify-between group"
                >
                  <span>View Size Guide</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Modals */}
      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        productType={productType}
      />

    </div >
  )
}

function CopyIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  )
}
