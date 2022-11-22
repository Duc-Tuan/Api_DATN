const Product = require("../Models/Product");

const getDataSearchName = (req, res, next) => {
  const dataSearch = new RegExp(req.query.name, "i");
  Product.find({ name: dataSearch })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

module.exports = { getDataSearchName };
