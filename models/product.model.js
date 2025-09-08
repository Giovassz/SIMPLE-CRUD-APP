const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true, // elimina espacios innecesarios
    },
    quantity: {
      type: Number,
      required: [true, "Please enter product quantity"],
      default: 0,
      min: [0, "Quantity cannot be negative"], // validación extra
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      default: 0,
      min: [0, "Price cannot be negative"], // validación extra
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true, // añade createdAt y updatedAt automáticamente
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
