const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const adminOrderController = require("../controllers/adminOrderController");

router.get("/admin/orders", requireAdmin, adminOrderController.listOrders);
router.get("/admin/orders/:id", requireAdmin, adminOrderController.viewOrder);
router.post("/admin/orders/:id/status", requireAdmin, adminOrderController.updateStatus);

module.exports = router;