const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const ProductSchema = new Schema({
  product_name: {
    type: String,
  },
  product_description: {
    type: String,
  },
  product_monney: {
    type: Number,
    default: 0,
  },
  product_qty: {
    type: Number,
    default: 1,
  },
  avatar: {
    type: String,
  },
  product_comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  product_category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Categorys",
    },
  ],
});

const Product = mongodb.model("Product", ProductSchema);
module.exports = Product;
