const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async listOrders(req, res) {
    const orders = await prisma.order.findMany({
      include: {
        user: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.render("admin/orders/list", {
      title: "All Orders",
      orders
    });
  },

  async viewOrder(req, res) {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: { include: { product: true } }
      }
    });

    if (!order) return res.status(404).send("Order not found");

    res.render("admin/orders/view", {
      title: `Order #${order.id}`,
      order,
      statuses: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]
    });
  },

  async updateStatus(req, res) {
    const id = Number(req.params.id);
    const { status } = req.body;

    await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.redirect(`/admin/orders/${id}`);
  }
};
