const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const orderController = require("../controllers/orderController");

router.get("/checkout", requireUser, orderController.checkoutPage);
router.post("/checkout", requireUser, orderController.placeOrder);

router.get("/orders", requireUser, orderController.listOrders);
router.get("/orders/:id", requireUser, orderController.viewOrder);

module.exports = router;