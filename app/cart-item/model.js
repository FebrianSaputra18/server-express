const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
  name: {
    type: String,
    minLength: [5, "Panjang nama makanan minimal 50 karakter"],
    maxLength: [true, "name must be filled"],
  },
  qty: {
    type: Number,
    required: [true, "qty must be greater than"],
    min: [1, "qty must be greater than"],
  },
  price: {
    type: Number,
    default: 0,
  },
  image_url: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = model("CartItem", cartItemSchema);
