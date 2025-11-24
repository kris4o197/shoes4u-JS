const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { requireAdmin } = require("../middleware/auth");

// PUBLIC
router.get("/", productController.listProducts);
router.get("/product/:id", productController.viewProduct);

// ADMIN
router.get("/admin/products", requireAdmin, productController.adminList);
router.get("/admin/products/create", requireAdmin, productController.createPage);
router.post("/admin/products/create", requireAdmin, productController.createProduct);

router.get("/admin/products/edit/:id", requireAdmin, productController.editPage);
router.post("/admin/products/edit/:id", requireAdmin, productController.updateProduct);

router.post("/admin/products/delete/:id", requireAdmin, productController.deleteProduct);

module.exports = router;