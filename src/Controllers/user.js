const User = require("../Models/user");
const Product = require("../Models/Product");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const index = (req, res, next) => {
  User.find({})
    .then((users) => {
      return res.status(200).json({
        users,
      });
    })
    .catch((err) => next(err));
};

const getloginUser = (req, res, next) => {
  const token = jwt.verify(req.body.token, "Anhtuan2002.");
  if (token) {
    return res.status(200).json({ data: token.user });
  } else {
    console.log("ERROR");
  }
};

const postLoginUser = (req, res, next) => {
  const { name, password } = req.body;
  User.findOne({ user_name: name, user_password: password })
    .then((user) => {
      const token = jwt.sign({ user }, "Anhtuan2002.");
      return res.status(200).json({ token });
    })
    .catch((err) => next(err));
};

const newUser = (req, res, next) => {
  const newUser = new User(req.body);
  if (req.file) {
    newUser.avatar = req.file.path;
  }
  console.log("newUser", newUser);
  // if (req.files) {
  //   let path = "";
  //   req.files.forEach((files, index, arr) => {
  //     path = path + files.path + ","
  //   })
  //   path = path.substring(0, path.lastIndexOf(","))
  //   newUser.avatar = path;
  // }
  newUser
    .save()
    .then((user) => {
      return res.status(201).json({ user });
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  console.log("req params ", req.params);
  const { userID } = req.params;

  User.findById(userID)
    .then((user) => {
      return res.status(201).json({ user });
    })
    .catch((err) => next(err));
};

// put: thay thế toàn bộ (all user)
const replaceUser = (req, res, next) => {
  const { userID } = req.params;

  const newUser = req.body;

  User.findByIdAndUpdate(userID, newUser)
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

// patch: cập nhật 1 hoặc nhiều (one user)
const updateUser = (req, res, next) => {
  const { userID } = req.params;

  const newUser = req.body;

  User.findByIdAndUpdate(userID, newUser)
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

const deleteUser = (req, res, next) => {
  const { userID } = req.params;
  User.findByIdAndDelete(userID)
    .then((user) => {
      const directoryPath =
        path.dirname(path.dirname(__dirname)) + `\\${user.avatar}`;
      try {
        fs.unlinkSync(directoryPath);
        res.status(200).send({
          message: "File is deleted.",
        });
      } catch (err) {
        res.status(500).send({
          message: "Could not delete the file. " + err,
        });
      }
      return res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

const getUserProduct = async (req, res, next) => {
  const { userID } = req.params;

  const user = await User.findById(userID).populate("user_cartsID");

  res.status(200).json({ carst: user.user_cartsID });
};

const newUseProduct = async (req, res, next) => {
  const { userID } = req.params;

  // create a new deck
  const newProducts = new Product(req.body);

  if (req.file) {
    newProducts.avatar = req.file.path;
  }

  // get user
  const user = await User.findById(userID);

  // newProducts.owner = user;

  await newProducts.save();

  user.user_cartsID.push(newProducts._id);

  await user.save();

  res.status(200).json({ carts: newProducts });
};

const deleteUserProduct = async (req, res, next) => {
  const { userID, productID } = req.params;

  const DeleteProd = await Cart.findByIdAndDelete(productID);

  await User.findByIdAndRemove({ user_cartsID: { _id: userID } });

  return res.status(200).json({ DeleteProd });
};

const deleteCartItem = async (req, res, next) => {
  const { userID, productID } = req.params;
  const user = await User.findById(userID);
  await Product.findByIdAndDelete(productID);
  const arr = user.user_cartsID.filter((item) => item.toString() !== productID);
  if (arr.length === 0) {
    const update = await User.findByIdAndUpdate(userID, { user_cartsID: [] });
    await update.save();
  } else {
    arr.map(async () => {
      const update = await User.findByIdAndUpdate(userID, {
        user_cartsID: [...arr],
      });
      await update.save();
    });
  }
  await user
    .save()
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

module.exports = {
  index,
  getloginUser,
  postLoginUser,
  newUser,
  getUserById,
  replaceUser,
  updateUser,
  deleteCartItem,
  deleteUser,
  getUserProduct,
  newUseProduct,
  deleteUserProduct,
};
