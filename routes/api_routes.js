const auth = require("../middleware/auth");

const express = require("express");
const router = express.Router();
const apiService = require("../services/api_service");

router.get("/auth", auth.authentication, apiService.getUsers);

router.post("/create-user", apiService.createUser);

router.post("/user-login", apiService.userLogin);

router.post("/create-category", auth.authentication, apiService.createCategory);

router.post("/create-product", auth.authentication, apiService.createProduct);

router.get("/get-categories", auth.authentication, apiService.getCategories);

router.get("/get-products/:category_id", auth.authentication, apiService.getProducts);

router.post("/update-product/:product_id", auth.authentication, apiService.updateCategory);

module.exports = router;
