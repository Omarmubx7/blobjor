"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { X, Eye, Search, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, Star, TrendingUp, ShoppingCart, Check, Package, Loader2, Ruler } from "lucide-react"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"
import { SizeChartModal } from "@/components/designer/size-chart-modal"

type Category = "hoodies" | "mugs" | "scarves" | "keychains" | "oldmoney"
type SortOption = "newest" | "price-low" | "price-high" | "popular"
type SubCategory = "all" | "anime" | "movies" | "series" | "sports" | "jordan" | "other"

interface Product {
  id: number
  title: string
  titleAr: string
  category: Category
  subCategory?: SubCategory
  price: number
  originalPrice: number | null
  image: string
  sale: boolean
  isBestseller?: boolean
  isNew?: boolean
}

const products: Product[] = [
  // Anime
  { id: 1, title: "Naruto", titleAr: "هودي ناروتو", category: "hoodies", subCategory: "anime", price: 12, originalPrice: null, image: "/images/Naruto.png", sale: false, isBestseller: true },
  { id: 2, title: "One Piece Black", titleAr: "هودي ون بيس أسود", category: "hoodies", subCategory: "anime", price: 12, originalPrice: null, image: "/images/One%20piece%20black.png", sale: false },
  { id: 3, title: "One Piece", titleAr: "هودي ون بيس", category: "hoodies", subCategory: "anime", price: 12, originalPrice: null, image: "/images/One%20piece.png", sale: false },
  { id: 4, title: "One Piece White", titleAr: "هودي ون بيس أبيض", category: "hoodies", subCategory: "anime", price: 12, originalPrice: null, image: "/images/onepeice%20white.png", sale: false, isNew: true },

  // Movies
  { id: 6, title: "Batman Black", titleAr: "هودي باتمان أسود", category: "hoodies", subCategory: "movies", price: 12, originalPrice: null, image: "/images/Batman%20Black.png", sale: false },
  { id: 7, title: "Batman White", titleAr: "هودي باتمان أبيض", category: "hoodies", subCategory: "movies", price: 12, originalPrice: null, image: "/images/Batman%20White.png", sale: false },
  { id: 8, title: "Harry Potter", titleAr: "هودي هاري بوتر", category: "hoodies", subCategory: "movies", price: 12, originalPrice: null, image: "/images/Harry%20Potter.png", sale: false, isBestseller: true },
  { id: 9, title: "Spider-Man", titleAr: "هودي سبايدر مان", category: "hoodies", subCategory: "movies", price: 12, originalPrice: null, image: "/images/Spider-man%20hoodie.png", sale: false, isNew: true },
  { id: 10, title: "Minecraft", titleAr: "هودي ماينكرافت", category: "hoodies", subCategory: "movies", price: 12, originalPrice: null, image: "/images/minecraft%20front.png", sale: false },

  // Series
  { id: 11, title: "Friends Black", titleAr: "هودي فريندز أسود", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/frends%20hoodie%20black.png", sale: false },
  { id: 12, title: "Friends Hoodie", titleAr: "هودي فريندز", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/Friends%20hoodie%20black.%20.png", sale: false },
  { id: 13, title: "Friends Classic", titleAr: "هودي فريندز كلاسيك", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/frinends%20hoodie%20black.png", sale: false, isBestseller: true },
  { id: 14, title: "Game of Thrones", titleAr: "هودي صراع العروش", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/Game%20of%20Thrones.png", sale: false },
  { id: 15, title: "Game of Thrones Quote", titleAr: "هودي اقتباس صراع العروش", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/Game%20of%20ThronesQuote%20.png", sale: false },
  { id: 16, title: "Stranger Things", titleAr: "هودي أشياء غريبة", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/Stranger%20things%20Hoodie.png", sale: false },
  { id: 17, title: "Breaking Bad", titleAr: "هودي بريكنج باد", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/Breaking%20Bad.png", sale: false },
  { id: 18, title: "I Am The Danger", titleAr: "هودي أنا الخطر", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/I'm%20not%20a%20danger,%20I%20am%20the%20danger.png", sale: false },
  { id: 19, title: "Say My Name", titleAr: "هودي قل اسمي", category: "hoodies", subCategory: "series", price: 12, originalPrice: null, image: "/images/Say%20my%20name.png", sale: false },

  // Sports
  { id: 20, title: "Barcelona Black", titleAr: "هودي برشلونة أسود", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/Barcelona%20Black.png", sale: false },
  { id: 21, title: "Barcelona White", titleAr: "هودي برشلونة أبيض", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/Barcelona%20White.png", sale: false },
  { id: 22, title: "Real Madrid", titleAr: "هودي ريال مدريد", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/Real%20Madrid.png", sale: false },
  { id: 23, title: "Real Madrid Kit", titleAr: "هودي طقم ريال مدريد", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/Real%20Madrid%20kit.png", sale: false, isNew: true },
  { id: 24, title: "CR7", titleAr: "هودي كريستيانو رونالدو", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/CR7%20front.png", sale: false, isBestseller: true },
  { id: 25, title: "Messi", titleAr: "هودي ميسي", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/messi%20front.png", sale: false, isBestseller: true },
  { id: 26, title: "Mercedes F1 Black", titleAr: "هودي مرسيدس F1 أسود", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/Mercedes%20f1.png", sale: false },
  { id: 27, title: "Mercedes F1 White", titleAr: "هودي مرسيدس F1 أبيض", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/Mercedes%20white.png", sale: false },
  { id: 28, title: "Red Bull F1", titleAr: "هودي ريد بول F1", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/Redbull%20f1.png", sale: false, isNew: true },
  { id: 29, title: "Jordan Team", titleAr: "هودي منتخب الأردن", category: "hoodies", subCategory: "sports", price: 12, originalPrice: null, image: "/images/JordanTeam.png", sale: false },

  // Jordan/Palestine
  { id: 30, title: "Palestine", titleAr: "هودي فلسطين", category: "hoodies", subCategory: "jordan", price: 12, originalPrice: null, image: "/images/Palestine%20Front.png", sale: false, isBestseller: true },
]

const mugProducts: Product[] = [
  { id: 101, title: "Anime Mug", titleAr: "كوب أنمي", category: "mugs", subCategory: "anime", price: 3, originalPrice: null, image: "/images/anime%20mug.png", sale: false },
  { id: 102, title: "Baby Yoda Mug", titleAr: "كوب بيبي يودا", category: "mugs", subCategory: "movies", price: 3, originalPrice: null, image: "/images/baby%20yuda%20mug.png", sale: false, isBestseller: true },
  { id: 103, title: "Batman Mug", titleAr: "كوب باتمان", category: "mugs", subCategory: "movies", price: 3, originalPrice: null, image: "/images/batman%20mug.png", sale: false },
  { id: 104, title: "Friends Mug", titleAr: "كوب فريندز", category: "mugs", subCategory: "series", price: 3, originalPrice: null, image: "/images/friends%20mug.png", sale: false, isBestseller: true },
  { id: 105, title: "Heisenberg Mug", titleAr: "كوب هايزنبرج", category: "mugs", subCategory: "series", price: 3, originalPrice: null, image: "/images/Heisenberg%20Mug.png", sale: false },
  { id: 106, title: "Hellfire Club Mug", titleAr: "كوب نادي الجحيم", category: "mugs", subCategory: "series", price: 3, originalPrice: null, image: "/images/Hellfire%20mug.png", sale: false, isNew: true },
  { id: 107, title: "Quote Mug", titleAr: "كوب اقتباس", category: "mugs", subCategory: "other", price: 3, originalPrice: null, image: "/images/quote%20mug.png", sale: false },
  { id: 108, title: "Stranger Things Mug", titleAr: "كوب أشياء غريبة", category: "mugs", subCategory: "series", price: 3, originalPrice: null, image: "/images/Stranger%20things%20mug.png", sale: false },
  { id: 109, title: "Stranger Things Red Mug", titleAr: "كوب أشياء غريبة أحمر", category: "mugs", subCategory: "series", price: 3, originalPrice: null, image: "/images/Stranger%20thingsred%20mug.png", sale: false },
]

const scarfProducts: Product[] = [
  // Scarves - add your scarf products here
]

const keychainProducts: Product[] = [
  // Keychains - add your keychain products here
]

const oldmoneyProducts: Product[] = [
  // Old Money - add your old money products here
]

const subCategories: { value: SubCategory; label: string; labelEn: string }[] = [
  { value: "all", label: "الكل", labelEn: "All" },
  { value: "anime", label: "أنمي", labelEn: "Anime" },
  { value: "movies", label: "أفلام", labelEn: "Movies" },
  { value: "series", label: "مسلسلات", labelEn: "Series" },
  { value: "sports", label: "رياضة", labelEn: "Sports" },
  { value: "jordan", label: "أردن", labelEn: "Jordan" },
  { value: "other", label: "أخرى", labelEn: "Other" },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "الأحدث" },
  { value: "popular", label: "الأكثر مبيعاً" },
  { value: "price-low", label: "السعر: من الأقل" },
  { value: "price-high", label: "السعر: من الأعلى" },
]

const ITEMS_PER_PAGE = 16

const hoodieSizes = ["22", "26", "30", "34", "36", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
const mugSizes = ["Standard"]

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function Products() {
  const { ref, isVisible } = useScrollAnimation()
  const { addItem } = useCart()
  const { addToast } = useToast()
  const [activeCategory, setActiveCategory] = useState<Category>("hoodies")
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null)
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)
  const [addToCartProduct, setAddToCartProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [showAddedFeedback, setShowAddedFeedback] = useState<number | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const allProducts = activeCategory === "hoodies" ? products : activeCategory === "mugs" ? mugProducts : activeCategory === "scarves" ? scarfProducts : activeCategory === "keychains" ? keychainProducts : oldmoneyProducts
  const hoodiesCount = products.length
  const mugsCount = mugProducts.length
  const scarvesCount = scarfProducts.length
  const keychainsCount = keychainProducts.length
  const oldmoneyCount = oldmoneyProducts.length

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Filter by subcategory
    if (activeSubCategory !== "all") {
      result = result.filter(p => p.subCategory === activeSubCategory)
    }

    // Filter by search (using debounced value)
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.titleAr.includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "popular":
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
        break
      case "newest":
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }

    return result
  }, [allProducts, activeSubCategory, debouncedSearchQuery, sortBy])

  const displayedProducts = filteredProducts.slice(0, visibleItems)
  const hasMore = visibleItems < filteredProducts.length

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true)
    // Simulate loading for smooth UX
    await new Promise(resolve => setTimeout(resolve, 300))
    setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length))
    setIsLoadingMore(false)
  }, [filteredProducts.length])

  const resetFilters = () => {
    setActiveSubCategory("all")
    setSearchQuery("")
    setSortBy("newest")
    setVisibleItems(ITEMS_PER_PAGE)
  }

  const openLightbox = (product: Product) => {
    setLightboxProduct(product)
  }

  const closeLightbox = () => {
    setLightboxProduct(null)
  }

  const openAddToCartModal = (product: Product) => {
    setAddToCartProduct(product)
    setSelectedSize(product.category === "mugs" ? "Standard" : "")
  }

  const closeAddToCartModal = () => {
    setAddToCartProduct(null)
    setSelectedSize("")
  }

  const handleAddToCart = () => {
    if (!addToCartProduct || !selectedSize) return

    addItem({
      id: addToCartProduct.id,
      title: addToCartProduct.title,
      titleAr: addToCartProduct.titleAr,
      price: addToCartProduct.price,
      image: addToCartProduct.image,
      size: selectedSize,
      category: addToCartProduct.category,
    })

    // Show feedback
    setShowAddedFeedback(addToCartProduct.id)
    setTimeout(() => setShowAddedFeedback(null), 2000)

    // Show toast notification
    addToast({
      type: "cart",
      message: `تم إضافة ${addToCartProduct.titleAr} للسلة`,
    })

    closeAddToCartModal()
  }

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.category === "mugs") {
      // Mugs don't need size selection
      addItem({
        id: product.id,
        title: product.title,
        titleAr: product.titleAr,
        price: product.price,
        image: product.image,
        size: "Standard",
        category: product.category,
      })
      setShowAddedFeedback(product.id)
      setTimeout(() => setShowAddedFeedback(null), 2000)

      // Show toast notification
      addToast({
        type: "cart",
        message: `تم إضافة ${product.titleAr} للسلة`,
      })
    } else {
      openAddToCartModal(product)
    }
  }

  return (
    <section id="shop" className="section-white py-16 lg:py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-[1400px] px-4 transition-all duration-700 lg:px-8 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
      >
        {/* Section Header */}
        <div className="mb-8 text-center lg:mb-12">
          <span className="badge badge-primary mb-4">
            <TrendingUp size={12} />
            PRODUCTS
          </span>
          <h2 className="font-sans text-3xl font-black tracking-tight text-foreground lg:text-5xl">
            منتجاتنا
          </h2>
          <p className="mt-3 font-body text-base text-muted-foreground">
            تصاميم فريدة وجودة عالية
          </p>
        </div>

        {/* Main Category Tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => { setActiveCategory("hoodies"); resetFilters(); }}
            className={`group relative overflow-hidden rounded-2xl px-8 py-4 font-body text-base font-bold transition-all duration-300 ${activeCategory === "hoodies"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card text-foreground hover:bg-card-hover border border-border"
              }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              🧥 هوديز Hoodies
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeCategory === "hoodies"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
                }`}>
                {hoodiesCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => { setActiveCategory("mugs"); resetFilters(); }}
            className={`group relative overflow-hidden rounded-2xl px-8 py-4 font-body text-base font-bold transition-all duration-300 ${activeCategory === "mugs"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card text-foreground hover:bg-card-hover border border-border"
              }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              ☕ أكواب Mugs
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeCategory === "mugs"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
                }`}>
                {mugsCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => { setActiveCategory("scarves"); resetFilters(); }}
            className={`group relative overflow-hidden rounded-2xl px-8 py-4 font-body text-base font-bold transition-all duration-300 ${activeCategory === "scarves"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card text-foreground hover:bg-card-hover border border-border"
              }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              🧣 أوشحة Scarves
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeCategory === "scarves"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
                }`}>
                {scarvesCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => { setActiveCategory("keychains"); resetFilters(); }}
            className={`group relative overflow-hidden rounded-2xl px-8 py-4 font-body text-base font-bold transition-all duration-300 ${activeCategory === "keychains"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card text-foreground hover:bg-card-hover border border-border"
              }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              🔑 ميداليات Keychains
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeCategory === "keychains"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
                }`}>
                {keychainsCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => { setActiveCategory("oldmoney"); resetFilters(); }}
            className={`group relative overflow-hidden rounded-2xl px-8 py-4 font-body text-base font-bold transition-all duration-300 ${activeCategory === "oldmoney"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card text-foreground hover:bg-card-hover border border-border"
              }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              👔 أولد موني Old Money
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeCategory === "oldmoney"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
                }`}>
                {oldmoneyCount}
              </span>
            </span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 rounded-2xl bg-card border border-border p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sub-category filter (mobile toggle) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 font-body text-sm text-foreground transition-colors hover:bg-muted lg:hidden"
              >
                <SlidersHorizontal size={16} />
                فلترة
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none rounded-xl border border-border bg-background py-3 pr-4 pl-10 font-body text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Grid toggle - desktop only */}
              <div className="hidden lg:flex items-center gap-1 rounded-xl border border-border bg-background p-1">
                <button
                  onClick={() => setGridCols(3)}
                  className={`rounded-lg p-2 transition-colors ${gridCols === 3 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`rounded-lg p-2 transition-colors ${gridCols === 4 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Sub-category tabs */}
          <div className={`mt-4 flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            {subCategories.map(sub => (
              <button
                key={sub.value}
                onClick={() => setActiveSubCategory(sub.value)}
                className={`rounded-full px-4 py-2 font-body text-sm font-medium transition-all ${activeSubCategory === sub.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="font-body text-sm text-muted-foreground">
            عرض <span className="font-semibold text-foreground">{displayedProducts.length}</span> من <span className="font-semibold text-foreground">{filteredProducts.length}</span> منتج
          </p>
          {(activeSubCategory !== "all" || searchQuery) && (
            <button
              onClick={resetFilters}
              className="font-body text-sm text-primary hover:underline"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className={`grid gap-4 grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? 'lg:grid-cols-4 xl:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-3'}`}>
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                {/* Product Card */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group">

                  {/* Badges */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                    {/* Category Badge */}
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${product.subCategory === 'anime' ? 'bg-purple-600' :
                      product.subCategory === 'sports' ? 'bg-blue-600' :
                        product.subCategory === 'movies' ? 'bg-red-600' :
                          'bg-zinc-800'
                      }`}>
                      {product.subCategory === 'anime' ? 'ANIME' :
                        product.subCategory === 'sports' ? 'SPORT' :
                          product.subCategory === 'movies' ? 'MOVIE' :
                            'STREETWEAR'}
                    </span>

                    {/* AR/EN Badge */}
                    <span className="px-1.5 py-0.5 rounded-sm bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] font-bold text-white/90">
                      AR / EN
                    </span>

                    {product.isBestseller && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        <Star size={10} fill="currentColor" />
                        BESTSELLER
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div
                    className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#F1F5F9]"
                    onClick={() => openLightbox(product)}
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.titleAr}
                      fill
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
                      <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-body font-bold text-base text-foreground leading-tight text-right">
                          {product.titleAr}
                        </h3>
                        <p className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">
                          {product.title}
                        </p>
                      </div>
                      <span className="font-sans text-lg font-black text-primary">
                        {product.price}<span className="text-xs ml-0.5">JD</span>
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      disabled={showAddedFeedback === product.id}
                      className={`w-full rounded-lg py-2.5 font-bold text-sm transition-all flex items-center justify-center gap-2 ${showAddedFeedback === product.id
                        ? "bg-success text-white"
                        : "bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                      {showAddedFeedback === product.id ? (
                        <>
                          <Check size={16} />
                          ADDED
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          ADD TO CART
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-sans text-xl font-bold text-foreground">لا توجد نتائج</h3>
            <p className="mt-2 font-body text-muted-foreground">جرب البحث بكلمات مختلفة أو غيّر الفلاتر</p>
            <button
              onClick={resetFilters}
              className="mt-4 btn-primary"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="btn-secondary px-10 py-4 text-base flex items-center gap-2 disabled:opacity-70"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                <>عرض المزيد ({filteredProducts.length - visibleItems} منتج)</>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 p-4 backdrop-blur-sm animate-fade-in-up"
          onClick={closeLightbox}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground text-foreground transition-all hover:scale-110 hover:bg-accent"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
              <Image
                src={lightboxProduct.image}
                alt={lightboxProduct.titleAr}
                fill
                className="object-contain p-6"
              />

              {/* Badges in lightbox */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {lightboxProduct.isBestseller && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white">
                    <Star size={12} fill="currentColor" />
                    الأكثر مبيعاً
                  </span>
                )}
                {lightboxProduct.isNew && (
                  <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
                    جديد
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-card p-5 shadow-xl">
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">{lightboxProduct.title}</p>
                <h3 className="mt-1 font-sans text-xl font-bold text-foreground">
                  {lightboxProduct.titleAr}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-sans text-2xl font-black text-primary">
                    {lightboxProduct.price} JD
                  </span>
                  {lightboxProduct.originalPrice && (
                    <span className="font-body text-base text-muted-foreground line-through">
                      {lightboxProduct.originalPrice} JD
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => { closeLightbox(); openAddToCartModal(lightboxProduct); }}
                className="btn-primary py-3 px-6"
              >
                <ShoppingCart size={18} />
                أضف للسلة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Selection Modal */}
      {addToCartProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm animate-fade-in-up"
          onClick={closeAddToCartModal}
        >
          <div
            className="relative w-full max-w-md animate-scale-in rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeAddToCartModal}
              className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <X size={18} />
            </button>

            {/* Product Preview */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={addToCartProduct.image}
                  alt={addToCartProduct.titleAr}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase">{addToCartProduct.title}</p>
                <h4 className="font-sans text-lg font-bold text-foreground">{addToCartProduct.titleAr}</h4>
                <p className="font-sans text-base font-bold text-primary">{addToCartProduct.price} JD</p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h5 className="mb-3 font-sans text-sm font-bold text-foreground flex items-center gap-2">
                <Package size={16} />
                اختر المقاس
              </h5>

              {addToCartProduct.category === "hoodies" && (
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="mb-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  <Ruler size={14} />
                  جدول المقاسات
                </button>
              )}

              <div className="flex flex-wrap gap-2">
                {(addToCartProduct.category === "hoodies" ? hoodieSizes : mugSizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl border-2 px-5 py-2.5 font-body text-sm font-semibold transition-all ${selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full rounded-xl py-4 font-body text-base font-bold transition-all flex items-center justify-center gap-2 ${selectedSize
                ? "bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
            >
              <ShoppingCart size={20} />
              أضف إلى السلة
            </button>
          </div>
        </div>
      )}
      <SizeChartModal
        open={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        productType="hoodie"
      />
    </section>
  )
}
