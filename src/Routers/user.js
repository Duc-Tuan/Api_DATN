const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/user");
const uploadFile = require("../middlewares/uploadFile");
const uploadProduct = require("../middlewares/uploadImageProducts");

router.route("/")
  .get(UserController.index);

router.route("/login")
  .get(UserController.getloginUser)
  .post(UserController.postLoginUser);

router.route("/login")

router.route("/register")
  .post(uploadFile.single('avatar') ,UserController.newUser);

router.route("/:userID")
  .get(UserController.getUserById)
  .put(UserController.replaceUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);
  
router.route("/:userID/product")
  .get(UserController.getUserProduct)
  .post(uploadProduct.single('avatar') ,UserController.newUseProduct);
  
router.route("/:userID/product/:productID")
  .delete(UserController.deleteCartItem);

module.exports = router;
