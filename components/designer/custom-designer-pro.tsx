'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Upload, Type, Layers, ShoppingBag, Download,
  RotateCw, ZoomIn, ZoomOut, Trash2, Maximize2,
  Check, ChevronDown, AlignLeft, AlignCenter, AlignRight,
  Move, X, Undo2, Redo2, Eye, EyeOff, ArrowRight
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
    productImg.src = currentColor.image
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
            side: 'front',
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">

      {/* Font Loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@200..1000&family=Changa:wght@200..800&family=Lateef&family=Markazi+Text:wght@400..700&family=Noto+Naskh+Arabic:wght@400..700&family=Reem+Kufi:wght@400..700&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
      `}</style>

      {/* HEADER */}
      <div className="h-16 border-b border-white/10 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white" title="رجوع">
            <ArrowRight size={24} />
          </Link>
          <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-lg hidden sm:block">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            BloB<span className="text-cyan-400">.JO</span> Design Lab
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Download size={16} /> تحميل PNG
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 transform active:scale-95"
          >
            {isProcessing ? <Spinner className="w-4 h-4 text-white" /> : <ShoppingBag size={18} />}
            أضف للسلة - {currentProduct.price} JD
          </button>
        </div>
      </div>

      {/* 3-PANEL LAYOUT */}
      <div className="flex-1 overflow-hidden flex flex-col lg:grid lg:grid-cols-[280px_1fr_280px]">

        {/* LEFT PANEL: TOOLS */}
        <aside className="bg-slate-900 border-r border-white/10 flex flex-col z-20 shadow-xl order-2 lg:order-none h-1/3 lg:h-auto border-t lg:border-t-0">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'upload', icon: Upload, label: 'رفع' },
              { id: 'text', icon: Type, label: 'نص' },
              { id: 'layers', icon: Layers, label: 'طبقات' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors relative ${activeTab === tab.id ? 'text-cyan-400 bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <tab.icon size={20} />
                <span className="text-xs font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                )}
              </button>
            ))}
          </div>

          {/* Tools Component */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

            {/* UPLOAD TOOL */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-cyan-400/50 hover:bg-white/5 transition-all group text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all">
                    <Upload size={32} className="text-white/70 group-hover:text-cyan-400" />
                  </div>
                  <h3 className="font-bold mb-1">اضغط لرفع صورة</h3>
                  <p className="text-xs text-white/50">PNG, JPG بحد أقصى 10MB</p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                  <div className="flex gap-2 text-amber-200 font-bold text-xs">
                    ⚠️ ملاحظة هامة
                  </div>
                  <p className="text-[10px] text-amber-200/80 leading-relaxed">
                    يرجى التأكد من أن الصورة المرفقة عالية الوضوح والدقة. الصور غير الواضحة قد تؤخر عملية التصميم والطباعة. الحفاظ على الجودة يوفر الوقت ويضمن أفضل نتيجة!
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-200">
                  💡 نصيحة: استخدم صوراً بصيغة PNG وخلفية شفافة للحصول على أفضل نتيجة طباعة.
                </div>
              </div>
            )}

            {/* TEXT TOOL */}
            {activeTab === 'text' && (
              <div className="space-y-6">
                <div className="flex bg-white/10 p-1 rounded-lg">
                  <button
                    onClick={() => setTextLang('ar')}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${textLang === 'ar' ? 'bg-slate-800 text-white shadow-sm' : 'text-white/60'}`}
                  >
                    عربي
                  </button>
                  <button
                    onClick={() => setTextLang('en')}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${textLang === 'en' ? 'bg-slate-800 text-white shadow-sm' : 'text-white/60'}`}
                  >
                    English
                  </button>
                </div>

                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  dir={textLang === 'ar' ? 'rtl' : 'ltr'}
                  placeholder={textLang === 'ar' ? "اكتب النص هنا..." : "Type text here..."}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all min-h-[100px]"
                />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 font-medium">الخط</label>
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
                        className="w-full appearance-none bg-slate-800 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 text-white"
                        style={{ fontFamily: selectedFont }}
                      >
                        <optgroup label="✨ Fonts">
                          {(textLang === 'ar' ? FONTS.arabic : FONTS.english).map(font => (
                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                          ))}
                        </optgroup>
                      </select>
                      <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-white/50 font-medium">الحجم</label>
                      <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-center focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-white/50 font-medium">اللون</label>
                      <div className="relative h-[38px] rounded-lg overflow-hidden border border-white/10">
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
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
                >
                  أضف النص
                </button>
              </div>
            )}

            {/* LAYERS TOOL */}
            {activeTab === 'layers' && (
              <div className="space-y-2">
                {layers.length === 0 ? (
                  <div className="text-center py-10 text-white/30 text-sm">
                    لا توجد طبقات حتى الآن
                  </div>
                ) : (
                  layers.map((layer, index) => (
                    <div key={layer.id} className="bg-white/5 p-3 rounded-lg flex items-center gap-3 group hover:bg-white/10 transition-colors">
                      <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs">
                        {layer.type === 'i-text' ? 'T' : 'IMG'}
                      </div>
                      <span className="flex-1 truncate text-sm">{layer.text}</span>
                      <button className="text-white/30 hover:text-white p-1">
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
        <main className="relative bg-slate-950/50 flex items-center justify-center p-4 lg:p-10 perspective-1000 overflow-hidden order-1 lg:order-none flex-1">
          {/* Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 z-30 shadow-2xl">
            <button className="p-2 hover:bg-white/10 rounded-full text-white/80" onClick={handleClone} title="نسخ">
              <CopyIcon size={18} />
            </button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full text-white/80" onClick={handleDelete} title="حذف">
              <Trash2 size={18} />
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 flex items-center justify-center p-10 overflow-hidden relative">
            <div
              className="relative shadow-2xl rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                width: productType === 'hoodie' ? '400px' : '300px',
                height: productType === 'hoodie' ? '480px' : '300px',
              }}
            >
              {/* Product Image Background */}
              <img
                src={currentColor.image}
                alt="Product"
                className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
              />

              {/* Print Area Overlay + Canvas */}
              <div
                className="absolute z-10 border-2 border-dashed border-white/30 hover:border-cyan-400/50 transition-colors"
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
          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
            <div className="bg-white/10 backdrop-blur border border-white/10 p-1.5 rounded-lg flex flex-col gap-1">
              <button className="p-2 hover:bg-white/10 rounded-md text-white/70 hover:text-white"><ZoomIn size={20} /></button>
              <button className="p-2 hover:bg-white/10 rounded-md text-white/70 hover:text-white"><ZoomOut size={20} /></button>
              <button className="p-2 hover:bg-white/10 rounded-md text-white/70 hover:text-white"><Maximize2 size={20} /></button>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: PRODUCT OPTIONS */}
        <aside className="bg-slate-900 border-l border-white/10 flex flex-col z-20 shadow-xl p-6 gap-8 overflow-y-auto custom-scrollbar order-3 lg:order-none h-auto lg:h-full border-t lg:border-t-0 pb-20 lg:pb-6">

          {/* Product Info */}
          <div>
            <h2 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4">المنتج</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(PRODUCTS).map(p => (
                <button
                  key={p.id}
                  onClick={() => setProductType(p.id as any)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${productType === p.id
                    ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-white/5 border-transparent hover:border-white/20'
                    }`}
                >
                  <span className="text-2xl">{p.id === 'hoodie' ? '🧥' : '☕'}</span>
                  <span className="font-bold text-sm">{p.name}</span>
                  <span className="text-xs text-cyan-400">{p.price} JD</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h2 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4">اللون</h2>
            <div className="flex flex-wrap gap-3">
              {currentProduct.colors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all relative ${selectedColor === c.id
                    ? 'border-cyan-400 scale-110 shadow-lg'
                    : 'border-white/10 hover:scale-105'
                    }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.id && <Check size={16} className={`absolute inset-0 m-auto ${c.id === 'white' ? 'text-black' : 'text-white'}`} />}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes (Hoodie Only) */}
          {productType === 'hoodie' && (
            <div>
              <h2 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4">المقاس</h2>
              <div className="flex flex-wrap gap-2">
                {currentProduct.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${selectedSize === s
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Size Chart Button */}
              <button
                onClick={() => setSizeChartOpen(true)}
                className="mt-4 w-full py-2.5 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all flex items-center justify-center gap-2 text-white/80"
              >
                <Maximize2 size={16} /> جدول المقاسات
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="mt-auto bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/50">سعر المنتج</span>
              <span className="font-medium">{currentProduct.price} JD</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/50">الطباعة</span>
              <span className="font-medium text-cyan-400">مجاناً</span>
            </div>
            <div className="h-px bg-white/10 my-3" />
            <div className="flex justify-between items-center">
              <span className="font-bold">المجموع</span>
              <span className="text-xl font-bold">{currentProduct.price} JD</span>
            </div>
          </div>

        </aside>

      </div>

      {/* Modals */}
      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        productType={productType}
      />

    </div>
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
