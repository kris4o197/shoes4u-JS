const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async checkoutPage(req, res) {
    const userId = req.session.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    const total = cartItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    res.render("orders/checkout", {
      title: "Checkout",
      cartItems,
      total
    });
  },

  async placeOrder(req, res) {
    const userId = req.session.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.redirect("/cart");
    }

    const totalPrice = cartItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    // 1. Create order
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice
      }
    });

    // 2. Create order items
    for (const item of cartItems) {
      await prisma.orderItem.create({
  data: {
    quantity: item.quantity,
    price: item.product.price,
    productId: item.product.id,
    orderId: order.id,

    // 🔥 Snapshot данните
    productName: item.product.name,
    productPrice: item.product.price,
  }
});
    }

    // 3. Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    // 4. Redirect to order page
    res.redirect(`/orders/${order.id}`);
  },

  async listOrders(req, res) {
    const userId = req.session.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.render("orders/list", {
      title: "My Orders",
      orders
    });
  },

  async viewOrder(req, res) {
  const id = Number(req.params.id);
  const userId = req.session.user.id;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.render("orders/view", { order });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading order");
  }
  }
};
