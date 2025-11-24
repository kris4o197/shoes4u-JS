const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // Show cart for logged user
  async viewCart(req, res) {
    const userId = req.session.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.render("cart/view", {
      title: "Your Cart",
      cartItems,
      total
    });
  },

  // Add a product to the cart
  async addToCart(req, res) {
    const userId = req.session.user.id;
    const productId = Number(req.params.id);

    // Check if already in cart:
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + 1 }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: 1
        }
      });
    }

    res.redirect("/cart");
  },

  // Remove item entirely
  async removeFromCart(req, res) {
    const userId = req.session.user.id;
    const productId = Number(req.params.id);

    await prisma.cartItem.deleteMany({
      where: { userId, productId }
    });

    res.redirect("/cart");
  },

  // Update quantity manually
  async updateQuantity(req, res) {
    const userId = req.session.user.id;
    const productId = Number(req.params.id);
    const { quantity } = req.body;

    await prisma.cartItem.updateMany({
      where: { userId, productId },
      data: { quantity: Number(quantity) }
    });

    res.redirect("/cart");
  }
};
