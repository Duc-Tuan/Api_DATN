const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const UserSchema = new Schema(
  {
    user_aliases: {
      type: String,
    },
    user_name: {
      type: String,
    },
    user_password: {
      type: String,
    },
    user_email: {
      type: String,
    },
    avatar: {
      type: String,
    },
    user_cartsID: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    user_comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongodb.model("User", UserSchema);
module.exports = User;
