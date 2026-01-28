'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Upload, X, ImageIcon, ArrowRight, Save, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductImage {
  id?: string
  url: string
  publicId?: string | null
  altText?: string | null
  sortOrder: number
}

interface ProductVariant {
  id?: string
  color: string
  size: string
  stock: number
  sku?: string | null
  isActive: boolean
}

interface ProductFormProps {
  categories: Category[]
  product?: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    compareAtPrice: number | null
    categoryId: string | null
    isActive: boolean
    isFeatured: boolean
    allowCustomDesign: boolean
    images: ProductImage[]
    variants?: ProductVariant[]
  }
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const AVAILABLE_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Navy', value: '#1E3A8A' },
  { name: 'Grey', value: '#6B7280' },
  { name: 'Green', value: '#10B981' },
]

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    compareAtPrice: product?.compareAtPrice?.toString() || '',
    categoryId: product?.categoryId || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    allowCustomDesign: product?.allowCustomDesign ?? false,
  })

  const [images, setImages] = useState<ProductImage[]>(product?.images || [])
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || [])

  // temporary selection state
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize selected sizes/colors from existing variants if editing
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const sizes = Array.from(new Set(product.variants.map(v => v.size)))
      const colors = Array.from(new Set(product.variants.map(v => v.color)))
      setSelectedSizes(sizes)
      setSelectedColors(colors)
    }
  }, [product])

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name), // Only generate if empty
    }))
  }

  // Variant Logic
  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const generateVariants = () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      alert('الرجاء اختيار مقاس واحد ولون واحد على الأقل')
      return
    }

    const newVariants: ProductVariant[] = []

    selectedColors.forEach(color => {
      selectedSizes.forEach(size => {
        // Check if variant already exists
        const existing = variants.find(v => v.color === color && v.size === size)

        if (existing) {
          newVariants.push(existing)
        } else {
          newVariants.push({
            color,
            size,
            stock: 0,
            isActive: true,
            sku: `${formData.slug || 'PROD'}-${color}-${size}`.toUpperCase()
          })
        }
      })
    })

    setVariants(newVariants)
  }

  const updateVariantStock = (index: number, stock: string) => {
    const newVariants = [...variants]
    newVariants[index].stock = parseInt(stock) || 0
    setVariants(newVariants)
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  // Image upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingImages(true)

    try {
      const formData = new FormData()
      acceptedFiles.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('folder', 'blob-jo/products')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل رفع الصور')
      }

      const newImages = data.images || [data.image]
      setImages((prev) => [
        ...prev,
        ...newImages.map((img: { url: string; publicId: string }, index: number) => ({
          url: img.url,
          publicId: img.publicId,
          sortOrder: prev.length + index,
        })),
      ])
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'فشل رفع الصور')
    } finally {
      setUploadingImages(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploadingImages,
  })

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]

    if (imageToRemove.publicId) {
      try {
        await fetch('/api/admin/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicIds: imageToRemove.publicId }),
        })
      } catch (error) {
        console.error('Failed to delete image from cloud:', error)
      }
    }

    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب'
    if (!formData.slug.trim()) newErrors.slug = 'الرابط مطلوب'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'السعر مطلوب'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        categoryId: formData.categoryId || null,
        images: images.map((img, index) => ({
          ...img,
          sortOrder: index,
        })),
        variants: variants.map(v => ({
          ...v,
          stock: v.stock || 0
        }))
      }

      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'

      const response = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل حفظ المنتج')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      console.error('Submit error:', error)
      alert(error instanceof Error ? error.message : 'فشل حفظ المنتج')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المنتج *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="مثال: هودي كلاسيكي"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">الرابط (Slug) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="hoodie-classic"
                  className={errors.slug ? 'border-destructive' : ''}
                  dir="ltr"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف المنتج..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>المخزون والأنواع</CardTitle>
              <CardDescription>
                قم باختيار الألوان والمقاسات المتاحة لتوليد قائمة بالمخزون
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selectors */}
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">المقاسات المتاحة</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SIZES.map(size => (
                      <Badge
                        key={size}
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">الألوان المتاحة</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COLORS.map(color => (
                      <Badge
                        key={color.name}
                        variant={selectedColors.includes(color.name) ? "default" : "outline"}
                        className={`cursor-pointer gap-2 ${selectedColors.includes(color.name) ? 'bg-primary' : ''}`}
                        onClick={() => toggleColor(color.name)}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-white/20"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={generateVariants}
                  disabled={selectedSizes.length === 0 || selectedColors.length === 0}
                  className="w-full sm:w-auto"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  تحديث قائمة الأنواع
                </Button>
              </div>

              {/* Variants Table */}
              {variants.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 font-medium">اللون</th>
                        <th className="p-3 font-medium">المقاس</th>
                        <th className="p-3 font-medium w-32">الكمية</th>
                        <th className="p-3 font-medium w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {variants.map((variant, idx) => (
                        <tr key={`${variant.color}-${variant.size}`} className="hover:bg-muted/20">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full border border-border"
                                style={{ backgroundColor: AVAILABLE_COLORS.find(c => c.name === variant.color)?.value || '#000' }}
                              />
                              {variant.color}
                            </div>
                          </td>
                          <td className="p-3 font-mono">{variant.size}</td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(e) => updateVariantStock(idx, e.target.value)}
                              className="h-8"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeVariant(idx)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>الصور</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
                  } ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                {uploadingImages ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                    <p className="text-muted-foreground">جارٍ رفع الصور...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {isDragActive
                        ? 'أفلت الصور هنا...'
                        : 'اسحب وأفلت الصور هنا أو انقر للاختيار'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP حتى 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `صورة ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 left-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          رئيسية
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>التسعير</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر (د.أ) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className={errors.price ? 'border-destructive' : ''}
                  dir="ltr"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">السعر قبل الخصم (د.أ)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, compareAtPrice: e.target.value }))}
                  placeholder="0.00"
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>التنظيم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>التصنيف</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>الحالة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">منشور</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">مميز</Label>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allowCustomDesign">يدعم التصميم المخصص</Label>
                <Switch
                  id="allowCustomDesign"
                  checked={formData.allowCustomDesign}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowCustomDesign: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
        <Link href="/admin/products">
          <Button type="button" variant="outline">
            <ArrowRight className="ml-2 h-4 w-4" />
            رجوع
          </Button>
        </Link>
        <div className="flex-1" />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <Save className="ml-2 h-4 w-4" />
              {product ? 'حفظ التغييرات' : 'إضافة المنتج'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
