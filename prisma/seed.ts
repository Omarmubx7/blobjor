import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Admin User
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.adminUser.upsert({
    where: { email: "admin@blob.jo" },
    update: {},
    create: {
      email: "admin@blob.jo",
      passwordHash,
      name: "مدير النظام",
      role: "super_admin",
      isActive: true,
    },
  });
  console.log("✅ Admin user created: admin@blob.jo / admin123");

  // Seed Categories
  const categories = [
    {
      name: "هوديز",
      nameEn: "Hoodies",
      slug: "hoodies",
      description: "هوديز قطنية عالية الجودة مع تصاميم مخصصة",
      sortOrder: 1,
    },
    {
      name: "تيشيرتات",
      nameEn: "T-Shirts",
      slug: "tshirts",
      description: "تيشيرتات قطنية مريحة بتصاميم فريدة",
      sortOrder: 2,
    },
    {
      name: "أكواب",
      nameEn: "Mugs",
      slug: "mugs",
      description: "أكواب سيراميك مع طباعة عالية الجودة",
      sortOrder: 3,
    },
    {
      name: "ملصقات",
      nameEn: "Stickers",
      slug: "stickers",
      description: "ملصقات فينيل مقاومة للماء",
      sortOrder: 4,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // Get created categories
  const hoodiesCategory = await prisma.category.findUnique({ where: { slug: "hoodies" } });
  const tshirtsCategory = await prisma.category.findUnique({ where: { slug: "tshirts" } });
  const mugsCategory = await prisma.category.findUnique({ where: { slug: "mugs" } });

  // Seed Products
  const products = [
    {
      name: "هودي وطن",
      nameAr: "هودي وطن",
      slug: "watan-hoodie",
      description: "هودي قطني فاخر مع خط عربي مميز - تصميم وطني أردني",
      price: 35,
      compareAtPrice: 45,
      categoryId: hoodiesCategory?.id,
      colors: ["أسود", "أبيض", "رمادي", "كحلي"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      isActive: true,
      isFeatured: true,
      allowCustomDesign: true,
    },
    {
      name: "هودي عمّان",
      nameAr: "هودي عمّان",
      slug: "amman-hoodie",
      description: "هودي بتصميم مدينة عمّان - أظهر حبك للعاصمة",
      price: 35,
      categoryId: hoodiesCategory?.id,
      colors: ["أسود", "أبيض", "زيتي"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      isActive: true,
      isFeatured: false,
      allowCustomDesign: true,
    },
    {
      name: "تيشيرت كلاسيك",
      nameAr: "تيشيرت كلاسيك",
      slug: "classic-tshirt",
      description: "تيشيرت قطني مريح للاستخدام اليومي",
      price: 12,
      compareAtPrice: 15,
      categoryId: tshirtsCategory?.id,
      colors: ["أسود", "أبيض", "رمادي", "كحلي", "أحمر"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      isActive: true,
      isFeatured: true,
      allowCustomDesign: true,
    },
    {
      name: "كوب اقتباس عربي",
      nameAr: "كوب اقتباس عربي",
      slug: "arabic-quote-mug",
      description: "كوب سيراميك بتصميم خط عربي جميل",
      price: 3,
      categoryId: mugsCategory?.id,
      colors: ["أبيض", "أسود"],
      sizes: ["Standard"],
      isActive: true,
      isFeatured: true,
      allowCustomDesign: true,
    },
    {
      name: "كوب مخصص",
      nameAr: "كوب مخصص",
      slug: "custom-mug",
      description: "صمم كوبك الخاص بالصور والنصوص التي تريدها",
      price: 3,
      categoryId: mugsCategory?.id,
      colors: ["أبيض"],
      sizes: ["Standard"],
      isActive: true,
      isFeatured: false,
      allowCustomDesign: true,
    },
  ];

  for (const product of products) {
    // Generate variants
    const variants = [];
    for (const color of product.colors) {
      for (const size of product.sizes) {
        variants.push({
          color,
          size,
          stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10 and 60
          sku: `${product.slug}-${color}-${size}`.toUpperCase(),
          isActive: true
        });
      }
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        categoryId: product.categoryId,
        colors: JSON.stringify(product.colors),
        sizes: JSON.stringify(product.sizes),
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        allowCustomDesign: product.allowCustomDesign,
      },
      create: {
        name: product.name,
        nameAr: product.nameAr,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        categoryId: product.categoryId,
        colors: JSON.stringify(product.colors),
        sizes: JSON.stringify(product.sizes),
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        allowCustomDesign: product.allowCustomDesign,
        variants: {
          create: variants
        }
      },
    });
  }
  console.log(`✅ Seeded ${products.length} products with variants`);

  // Seed Settings
  const settings = [
    { key: "store_name", value: "BloB.JO", type: "string", group: "general" },
    { key: "store_name_ar", value: "بلوب", type: "string", group: "general" },
    { key: "contact_phone", value: "+962791234567", type: "string", group: "contact" },
    { key: "contact_email", value: "info@blob.jo", type: "string", group: "contact" },
    { key: "contact_instagram", value: "@blob.jo", type: "string", group: "contact" },
    { key: "contact_whatsapp", value: "+962791234567", type: "string", group: "contact" },
    { key: "delivery_amman", value: "0", type: "number", group: "shipping" },
    { key: "delivery_outside", value: "2", type: "number", group: "shipping" },
    { key: "free_shipping_threshold", value: "50", type: "number", group: "shipping" },
    { key: "meta_title", value: "BloB.JO - طباعة حسب الطلب في الأردن", type: "string", group: "seo" },
    { key: "meta_description", value: "أنشئ منتجات مخصصة بتصميمك الخاص - هوديز، تيشيرتات، أكواب وأكثر", type: "string", group: "seo" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type, group: setting.group },
      create: setting,
    });
  }
  console.log(`✅ Seeded ${settings.length} settings`);

  // Seed Homepage Sections
  const sections = [
    {
      sectionKey: "hero",
      title: "حوّل أفكارك إلى واقع",
      titleAr: "حوّل أفكارك إلى واقع",
      subtitle: "صمم منتجاتك الخاصة بسهولة واحصل عليها بجودة عالية",
      subtitleAr: "صمم منتجاتك الخاصة بسهولة واحصل عليها بجودة عالية",
      ctaText: "ابدأ الآن",
      ctaTextAr: "ابدأ الآن",
      ctaLink: "/products",
      isActive: true,
      sortOrder: 1,
    },
    {
      sectionKey: "featured_products",
      title: "منتجات مميزة",
      titleAr: "منتجات مميزة",
      subtitle: "اكتشف أحدث تصاميمنا",
      subtitleAr: "اكتشف أحدث تصاميمنا",
      isActive: true,
      sortOrder: 2,
    },
    {
      sectionKey: "how_it_works",
      title: "كيف يعمل؟",
      titleAr: "كيف يعمل؟",
      subtitle: "أربع خطوات بسيطة للحصول على منتجك المخصص",
      subtitleAr: "أربع خطوات بسيطة للحصول على منتجك المخصص",
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: section,
      create: section,
    });
  }
  console.log(`✅ Seeded ${sections.length} homepage sections`);

  // Seed FAQs
  const faqs = [
    {
      question: "How long does delivery take?",
      questionAr: "كم يستغرق وقت التوصيل؟",
      answer: "Delivery takes 2-4 business days within Amman, and 3-5 days for other cities.",
      answerAr: "التوصيل يستغرق 2-4 أيام عمل داخل عمّان، و3-5 أيام لباقي المحافظات.",
      category: "shipping",
      sortOrder: 1,
    },
    {
      question: "What payment methods do you accept?",
      questionAr: "ما هي طرق الدفع المتاحة؟",
      answer: "We accept cash on delivery and bank transfers.",
      answerAr: "نقبل الدفع نقداً عند الاستلام والتحويل البنكي.",
      category: "payment",
      sortOrder: 2,
    },
    {
      question: "Can I return or exchange products?",
      questionAr: "هل يمكنني إرجاع أو استبدال المنتجات؟",
      answer: "Custom products cannot be returned unless there's a manufacturing defect.",
      answerAr: "المنتجات المخصصة لا يمكن إرجاعها إلا في حالة وجود عيب تصنيعي.",
      category: "general",
      sortOrder: 3,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq,
    });
  }
  console.log(`✅ Seeded ${faqs.length} FAQs`);

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
