const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // PUBLIC: show all products
  async listProducts(req, res) {
  const { search, category, min, max } = req.query;

  const filters = {};

  // Search by name
  if (search) {
    filters.name = { contains: search, mode: "insensitive" };
  }

  // Category
  if (category) {
    filters.categoryId = Number(category);
  }

  // Price filters
  if (min || max) {
    filters.price = {};

    if (min) filters.price.gte = Number(min);
    if (max) filters.price.lte = Number(max);
  }

  // Fetch products with filters
  const products = await prisma.product.findMany({
    where: filters,
    include: { category: true }
  });

  const categories = await prisma.category.findMany();

  res.render("products/list", {
    title: "Shoes Store",
    products,
    categories,
    search,
    category,
    min,
    max
  });
},

  async viewProduct(req, res) {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) return res.status(404).send("Product not found");

    res.render("products/view", {
      title: product.name,
      product
    });
  },

  // ADMIN
  async adminList(req, res) {
    const products = await prisma.product.findMany({ include: { category: true } });

    res.render("products/admin-list", {
      title: "Manage Products",
      products
    });
  },

  async createPage(req, res) {
    const categories = await prisma.category.findMany();

    res.render("products/create", {
      title: "Create Product",
      categories
    });
  },

  async createProduct(req, res) {
    const { name, description, price, imageUrl, categoryId } = req.body;

    await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        categoryId: Number(categoryId)
      }
    });

    res.redirect("/admin/products");
  },

  async editPage(req, res) {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    const categories = await prisma.category.findMany();

    res.render("products/edit", {
      title: "Edit Product",
      product,
      categories
    });
  },

  async updateProduct(req, res) {
    const id = Number(req.params.id);
    const { name, description, price, imageUrl, categoryId } = req.body;

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        categoryId: Number(categoryId)
      }
    });

    res.redirect("/admin/products");
  },

  async deleteProduct(req, res) {
  const productId = Number(req.params.id);

  try {
    // 1) Намираме поръчките, които съдържат продукта
    const orderItems = await prisma.orderItem.findMany({
      where: { productId },
      include: { order: true }
    });

    // 2) Cancel-ваме поръчките, които не са delivered
    for (const item of orderItems) {
      if (
        item.order.status !== "DELIVERED" &&
        item.order.status !== "CANCELLED"
      ) {
        await prisma.order.update({
          where: { id: item.orderId },
          data: { status: "CANCELLED" }
        });
      }
    }

    // 3) Премахваме продукта от cartItems
    await prisma.cartItem.deleteMany({
      where: { productId }
    });

    // 4) IMPORTANT: зануляваме productId в orderItems
    await prisma.orderItem.updateMany({
      where: { productId },
      data: { productId: null }
    });

    // 5) Изтриваме продукта
    await prisma.product.delete({
      where: { id: productId }
    });

    return res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error deleting product.");
  }
  }
}
