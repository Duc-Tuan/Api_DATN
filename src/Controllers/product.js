// const User = require("../Models/user");
const Product = require("../Models/Product");
const fs = require("fs");
const path = require("path");

const getAll = (req, res, next) => {
  var { page, pageSize } = req.query;
  var skipNumber;
  if (page || pageSize) {
    pageSize = parseInt(pageSize);
    page = parseInt(page);
    if (page < 1) page = 1;
    skipNumber = (page - 1) * pageSize;
    Product.find()
      .skip(skipNumber)
      .limit(pageSize)
      .then((data) => {
        Product.countDocuments({})
          .then((total) => {
            var totalPage = Math.ceil(total / pageSize);
            return res.status(200).json({ totalPage, data });
          })
          .catch((error) => next(error));
      })
      .catch((err) => next(err));
  } else {
    Product.find()
      .then((data) => {
        return res.status(200).json({ data });
      })
      .catch((err) => next(err));
  }
};

const addProduct = (req, res, next) => {
  const newProduct = new Product(req.body);
  if (req.file) {
    newProduct.avatar = req.file.path;
  }
  newProduct
    .save()
    .then((user) => {
      return res.status(201).json({ user });
    })
    .catch((err) => next(err));
};

const deleteProduct = async (req, res, next) => {
  const { productID } = req.params;

  Product.findByIdAndDelete(productID)
    .then((data) => {
      const directoryPath =
        path.dirname(path.dirname(__dirname)) + `\\${data.avatar}`;
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
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

module.exports = {
  getAll,
  addProduct,
  deleteProduct,
};
