const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Seed Categories ---
  const categoriesData = [
    { name: "Sneakers" },
    { name: "Running" },
    { name: "Lifestyle" },
    { name: "Skate" },
    { name: "Casual" },
    { name: "Training" },
    { name: "Boots" },
    { name: "Basketball" }
  ];

  const categories = {};

  // Create categories & map their IDs
  for (const c of categoriesData) {
    const category = await prisma.category.create({ data: c });
    categories[category.name] = category.id;
  }

  console.log("✔ Categories seeded");


  // --- Seed Products ---
  const products = [
    {
      name: "Nike Air Max 270",
      price: 159.99,
      description: "Леки, удобни и модерни – перфектни за ежедневно носене.",
      imageUrl: "/images/products/nike-airmax270.jpg",
      categoryId: categories["Sneakers"]
    },
    {
      name: "Adidas Ultraboost 22",
      price: 179.99,
      description: "Максимална амортизация и комфорт при бягане.",
      imageUrl: "/images/products/adidas-ultraboost22.jpg",
      categoryId: categories["Running"]
    },
    {
      name: "Puma RS-X³",
      price: 129.99,
      description: "Bold дизайн, супер подходящи за streetwear визии.",
      imageUrl: "/images/products/puma-rsx3.jpg",
      categoryId: categories["Lifestyle"]
    },
    {
      name: "Vans Old Skool Black",
      price: 74.99,
      description: "Класически модел, идеален за скейт или ежедневие.",
      imageUrl: "/images/products/vans-oldskool.jpg",
      categoryId: categories["Skate"]
    },
    {
      name: "Converse Chuck Taylor High",
      price: 69.99,
      description: "Иконични високи кецове, подходящи за всякакъв outfit.",
      imageUrl: "/images/products/converse-high.jpg",
      categoryId: categories["Lifestyle"]
    },
    {
      name: "New Balance 574 Classic",
      price: 89.99,
      description: "Комфорт, стабилност и ретро визия.",
      imageUrl: "/images/products/nb-574.jpg",
      categoryId: categories["Casual"]
    },
    {
      name: "Reebok Nano X2",
      price: 119.99,
      description: "Здрави и проектирани за фитнес тренировки.",
      imageUrl: "/images/products/reebok-nano.jpg",
      categoryId: categories["Training"]
    },
    {
      name: "Asics Gel-Kayano 28",
      price: 149.99,
      description: "Подходящи за дълги бягания, с gel cushioning.",
      imageUrl: "/images/products/asics-kayano.jpg",
      categoryId: categories["Running"]
    },
    {
      name: "Timberland Classic 6-Inch Boot",
      price: 189.99,
      description: "Зимни, водоустойчиви и супер издръжливи.",
      imageUrl: "/images/products/timberland-boot.jpg",
      categoryId: categories["Boots"]
    },
    {
      name: "Jordan 1 Mid Bred",
      price: 199.99,
      description: "Легендарен модел в червено-черен цвят.",
      imageUrl: "/images/products/jordan1-mid.jpg",
      categoryId: categories["Basketball"]
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✔ Products seeded");

  console.log("🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
