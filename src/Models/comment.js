const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const CommentSchema = new Schema(
  {
    comment_content: {
      type: String,
    },
    comment_user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongodb.model("Comment", CommentSchema);
module.exports = Comment;
