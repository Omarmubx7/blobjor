import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { WhyBlob } from "@/components/why-blob"
import prisma from "@/lib/prisma"
import { Products, ProductDisplay } from "@/components/products"
import { FAQ } from "@/components/faq"
import { Mission } from "@/components/mission"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: true,
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  // Map database products to the display format
  const mappedProducts: ProductDisplay[] = products.map(p => {
    // Determine category slug or fallback
    let categorySlug = "hoodies";
    if (p.category && p.category.slug) {
      // Simple mapping based on known slugs
      if (p.category.slug.includes('hoodie')) categorySlug = "hoodies";
      else if (p.category.slug.includes('mug')) categorySlug = "mugs";
      else if (p.category.slug.includes('tshirt')) categorySlug = "hoodies"; // Mapped to general clothing for now if needed, or mapped to new category
      // The component expects specific literals: "hoodies" | "mugs" | "scarves" | "keychains" | "oldmoney"
      // Adjust mapping:
      const s = p.category.slug;
      if (s === "mugs") categorySlug = "mugs";
      else if (s === "hoodies" || s === "tshirts") categorySlug = "hoodies"; // Group tshirts with hoodies for this UI or add tshirts to type
    }

    // Determine subcategory based on name/description (simple heuristic)
    let subCategory = "other";
    const text = (p.name + " " + (p.description || "")).toLowerCase();
    if (text.includes("anime") || text.includes("naruto") || text.includes("one piece")) subCategory = "anime";
    else if (text.includes("movie") || text.includes("batman") || text.includes("spider")) subCategory = "movies";
    else if (text.includes("series") || text.includes("friends") || text.includes("thrones")) subCategory = "series";
    else if (text.includes("sport") || text.includes("madrid") || text.includes("barcelona")) subCategory = "sports";
    else if (text.includes("jordan") || text.includes("palestine") || text.includes("amman")) subCategory = "jordan";

    return {
      id: p.id,
      title: p.name, // Using name as title (English/Generic)
      titleAr: p.nameAr || p.name,
      category: categorySlug as any, // Cast to match strict type or "hoodies" fallback
      subCategory: subCategory as any,
      price: p.price,
      originalPrice: p.compareAtPrice,
      image: p.images.find(img => img.isPrimary)?.url || p.images[0]?.url || "/placeholder.svg",
      sale: (p.compareAtPrice && p.compareAtPrice > p.price) ? true : false,
      isBestseller: p.isFeatured,
      isNew: false, // Could check createdAt
      colors: p.colors ? JSON.parse(p.colors) : [],
      sizes: p.sizes ? JSON.parse(p.sizes) : [],
    }
  })

  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <WhyBlob />
      <Products products={mappedProducts} />
      <FAQ />
      <Mission />
    </main>
  )
}
