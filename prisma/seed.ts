import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin account (so /admin works out of the box) ──────────────────
  // Override via env: ADMIN_EMAIL / ADMIN_PASSWORD
  const adminEmail = process.env.ADMIN_EMAIL || "admin@vaultpeptides.shop";
  const adminPassword = process.env.ADMIN_PASSWORD || "VaultAdmin@123";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Vault Admin",
      email: adminEmail,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });
  console.log(`👤 Admin ready → ${adminEmail} / ${adminPassword}`);

  const peptides = await prisma.category.upsert({
    where: { slug: "peptides" },
    update: {},
    create: { name: "Peptides", slug: "peptides", description: "High purity research peptides" },
  });

  const blends = await prisma.category.upsert({
    where: { slug: "blends" },
    update: {},
    create: { name: "Blends", slug: "blends", description: "Optimised peptide blends" },
  });

  const productsData = [
    {
      name: "Retatrutide",
      slug: "retatrutide",
      description: "Retatrutide is a triple-agonist GIP/GLP-1/glucagon receptor peptide under active research for metabolic and weight-management applications.",
      basePrice: 4999,
      images: ["/products/RETATRUTIDE 10mg.png"],
      categoryId: peptides.id,
      isFeatured: true,
      variants: [
        { name: "10mg", price: 4999, stock: 50 },
        { name: "15mg", price: 6999, stock: 50 },
        { name: "20mg", price: 8999, stock: 30 },
      ],
    },
    {
      name: "Tesamorelin",
      slug: "tesamorelin",
      description: "Tesamorelin is a synthetic analogue of growth-hormone-releasing hormone (GHRH) used in research involving GH secretion and body composition.",
      basePrice: 4499,
      images: ["/products/TESAMORELIN 5mg.png"],
      categoryId: peptides.id,
      isFeatured: false,
      variants: [
        { name: "5mg", price: 4499, stock: 60 },
        { name: "10mg", price: 7999, stock: 40 },
      ],
    },
    {
      name: "GHK-Cu",
      slug: "ghk-cu",
      description: "GHK-Cu (Copper peptide) is a naturally occurring human tripeptide researched for wound healing, skin remodelling, and anti-inflammatory properties.",
      basePrice: 3999,
      images: ["/products/GHKCu 50mg.png"],
      categoryId: peptides.id,
      isFeatured: false,
      variants: [
        { name: "50mg", price: 3999, stock: 80 },
        { name: "100mg", price: 6999, stock: 40 },
      ],
    },
    {
      name: "MOTS-c",
      slug: "mots-c",
      description: "MOTS-c is a mitochondria-derived peptide with emerging research in metabolic regulation, insulin sensitivity, and cellular energy homeostasis.",
      basePrice: 2999,
      images: ["/products/MOTSC 10mg.png"],
      categoryId: peptides.id,
      isFeatured: false,
      variants: [
        { name: "10mg", price: 2999, stock: 50 },
        { name: "20mg", price: 4999, stock: 40 },
        { name: "40mg", price: 8999, stock: 20 },
      ],
    },
    {
      name: "Semax",
      slug: "semax",
      description: "Semax is a synthetic peptide derived from ACTH, studied for neuroprotective, cognitive-enhancing, and neurotrophin-modulating effects.",
      basePrice: 3200,
      images: ["/products/Semax.png"],
      categoryId: peptides.id,
      isFeatured: false,
      variants: [
        { name: "10mg", price: 3200, stock: 60 },
      ],
    },
    {
      name: "Selank",
      slug: "selank",
      description: "Selank is a synthetic heptapeptide analogue of tuftsin, investigated for anxiolytic, immunomodulatory, and nootropic properties.",
      basePrice: 3200,
      images: ["/products/Selank.png"],
      categoryId: peptides.id,
      isFeatured: false,
      variants: [
        { name: "10mg", price: 3200, stock: 60 },
      ],
    },
    {
      name: "Glow Blend",
      slug: "glow-blend",
      description: "Glow Blend is a proprietary peptide combination developed for skin rejuvenation and anti-ageing research applications.",
      basePrice: 7999,
      images: ["/products/GLOW 80mg.png"],
      categoryId: blends.id,
      isFeatured: true,
      variants: [
        { name: "80mg", price: 7999, stock: 40 },
      ],
    },
    {
      name: "Klow Blend",
      slug: "klow-blend",
      description: "Klow Blend is a research formulation targeting inflammation modulation and joint-health pathways.",
      basePrice: 8999,
      images: ["/products/klow 80mg.png"],
      categoryId: blends.id,
      isFeatured: false,
      variants: [
        { name: "80mg", price: 8999, stock: 40 },
      ],
    },
    {
      name: "Wolverine Blend",
      slug: "wolverine-blend",
      description: "Wolverine Blend is a regenerative peptide stack researched for accelerated recovery and tissue-repair mechanisms.",
      basePrice: 3999,
      images: ["/products/WOLVERINE BLEND 10mg.png"],
      categoryId: blends.id,
      isFeatured: true,
      variants: [
        { name: "10mg", price: 3999, stock: 50 },
        { name: "20mg", price: 6999, stock: 30 },
      ],
    },
    {
      name: "CJC+IPA",
      slug: "cjc-ipa",
      description: "CJC-1295 without DAC combined with Ipamorelin — a dual GH secretagogue stack studied for growth hormone release and recovery research.",
      basePrice: 8999,
      images: ["/products/CJC-IPA-10mg.png"],
      categoryId: blends.id,
      isFeatured: false,
      variants: [
        { name: "10mg", price: 8999, stock: 50 },
      ],
    },
  ];

  for (const { variants, images, ...rest } of productsData) {
    // images stored as JSON-encoded string in a text column
    const productData = { ...rest, images: JSON.stringify(images) };
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: { ...productData },
      create: { ...productData, status: "ACTIVE" },
    });

    for (const variant of variants) {
      const sku = `${product.slug}-${variant.name.toLowerCase().replace(/\s+/g, "-")}`;
      const existing = await prisma.productVariant.findFirst({
        where: { productId: product.id, name: variant.name },
      });
      if (existing) {
        // Update price for existing variants
        await prisma.productVariant.update({
          where: { id: existing.id },
          data: { price: variant.price, stock: variant.stock },
        });
      } else {
        await prisma.productVariant.create({
          data: { productId: product.id, ...variant, sku },
        });
      }
    }
  }

  console.log("✅ Seed complete — products, variants, and prices updated.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
