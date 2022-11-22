const bodyParesr = require("body-parser");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const users = require("./Routers/user");
const products = require("./Routers/product");
const searchProducts = require("./Routers/searchProducts");

mongoose
  .connect(
    "mongodb+srv://admin:admin12345@cluster0.fkjkxce.mongodb.net/customerdb?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("connection success"))
  .catch((error) => console.error(`connection failed ${error}`));

//middleware
app.use(logger("dev"));
app.use(bodyParesr.json());

// Routes
app.use("/users", users);
app.use("/products", products);
app.use("/search/products", searchProducts);
app.use("/avatarUsers", express.static("src/Images/avatarUsers"));
app.use("/imageProduct", express.static("src/Images/ImageProducts"));

// Router
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK!",
  });
});

//catch 404 error and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
