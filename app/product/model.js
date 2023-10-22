const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, "name must be a minimum length of 3 characters"],
      required: [true, "name is required"],
    },
    description: {
      type: String,
      maxLength: [
        1000,
        "description must be a maximum length of 1000 characters",
      ],
      required: [true, "description is required"],
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "price is required"],
    },

    image_url: String,

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Reference to the 'Category' model
    },

    tags: [
      { type: Schema.Types.ObjectId, ref: "Tag" }, // Reference to the 'Tag' model
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
