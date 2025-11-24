const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { requireUser } = require("../middleware/auth");

router.get("/cart", requireUser, cartController.viewCart);
router.post("/cart/add/:id", requireUser, cartController.addToCart);
router.post("/cart/remove/:id", requireUser, cartController.removeFromCart);
router.post("/cart/update/:id", requireUser, cartController.updateQuantity);

module.exports = router;
