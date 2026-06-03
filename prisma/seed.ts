import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const category1 = await prisma.category.upsert({
    where: { slug: 'peptides' },
    update: {},
    create: {
      name: 'Peptides',
      slug: 'peptides',
      description: 'High purity research peptides',
    },
  })

  const category2 = await prisma.category.upsert({
    where: { slug: 'blends' },
    update: {},
    create: {
      name: 'Blends',
      slug: 'blends',
      description: 'Optimized peptide blends',
    },
  })

  const products = [
    { name: 'Retatrutide 10mg', slug: 'retatrutide-10mg', description: 'Retatrutide 10mg research peptide.', price: 10000, images: ['/products/RETATRUTIDE 10mg.png'], categoryId: category1.id, isFeatured: true },
    { name: 'Retatrutide 15mg', slug: 'retatrutide-15mg', description: 'Retatrutide 15mg research peptide.', price: 14000, images: ['/products/RETATRUTIDE 15mg.png'], categoryId: category1.id },
    { name: 'Retatrutide 20mg', slug: 'retatrutide-20mg', description: 'Retatrutide 20mg research peptide.', price: 18000, images: ['/products/RETATRUTIDE 20mg.png'], categoryId: category1.id, isFeatured: true },
    { name: 'Tesamorelin 5mg', slug: 'tesamorelin-5mg', description: 'Tesamorelin 5mg research peptide.', price: 5000, images: ['/products/TESAMORELIN 5mg.png'], categoryId: category1.id },
    { name: 'Tesamorelin 10mg', slug: 'tesamorelin-10mg', description: 'Tesamorelin 10mg research peptide.', price: 9000, images: ['/products/TESAMORELIN 10mg.png'], categoryId: category1.id },
    { name: 'GHK-Cu 50mg', slug: 'ghk-cu-50mg', description: 'GHK-Cu 50mg research peptide.', price: 4000, images: ['/products/GHKCu 50mg.png'], categoryId: category1.id },
    { name: 'GHK-Cu 100mg', slug: 'ghk-cu-100mg', description: 'GHK-Cu 100mg research peptide.', price: 7000, images: ['/products/GHKCu 100mg.png'], categoryId: category1.id },
    { name: 'Glow Blend', slug: 'glow-blend', description: 'Glow blend research compound (80mg).', price: 12000, images: ['/products/GLOW 80mg.png'], categoryId: category2.id, isFeatured: true },
    { name: 'Klow Blend', slug: 'klow-blend', description: 'Klow blend research compound (80mg).', price: 12000, images: ['/products/klow 80mg.png'], categoryId: category2.id },
    { name: 'MOTS-c 10mg', slug: 'mots-c-10mg', description: 'MOTS-c 10mg research peptide.', price: 6000, images: ['/products/MOTSC 10mg.png'], categoryId: category1.id },
    { name: 'MOTS-c 40mg', slug: 'mots-c-40mg', description: 'MOTS-c 40mg research peptide.', price: 20000, images: ['/products/MOTSC 40mg.png'], categoryId: category1.id },
    { name: 'Wolverine Blend 10mg', slug: 'wolverine-blend-10mg', description: 'Wolverine blend 10mg.', price: 8000, images: ['/products/WOLVERINE BLEND 10mg.png'], categoryId: category2.id },
    { name: 'Wolverine Blend 20mg', slug: 'wolverine-blend-20mg', description: 'Wolverine blend 20mg.', price: 15000, images: ['/products/WOLVERINE BLEND 20mg.png'], categoryId: category2.id, isFeatured: true },
    { name: 'Semax 10mg', slug: 'semax-10mg', description: 'Semax 10mg research peptide.', price: 4500, images: ['/products/Semax.png'], categoryId: category1.id },
    { name: 'Selank 10mg', slug: 'selank-10mg', description: 'Selank 10mg research peptide.', price: 4500, images: ['/products/Selank.png'], categoryId: category1.id },
    { name: 'CJC+IPA 10mg', slug: 'cjc-ipa-10mg', description: 'CJC-1295 without dac + ipamoreline 10mg.', price: 7500, images: ['/products/CJC-IPA-10mg.png'], categoryId: category2.id }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: {
        ...product,
        stock: 100,
        status: 'ACTIVE'
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })