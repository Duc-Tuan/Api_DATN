const express = require("express");
const routerProduct = express.Router();

const UserController = require("../Controllers/product");

const uploadProduct = require("../middlewares/uploadImageProducts");

routerProduct.route('/')
    .get(UserController.getAll)
    .post(uploadProduct.single('avatar') ,UserController.addProduct);

routerProduct.route('/:productID')
    .delete(UserController.deleteProduct);

module.exports = routerProduct;