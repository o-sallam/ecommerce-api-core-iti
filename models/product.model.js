const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot be longer than 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
      set: (val) => Math.round(val * 100) / 100, // Rounds to 2 decimal places
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
        required: [true, "At least one product image is required"],
      },
    ],
    shipping: {
      type: Boolean,
      default: true,
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
      },
    ],
    totalRating: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for product URL
productSchema.virtual("url").get(function () {
  return `/products/${this.slug}`;
});

// Index for text search
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

module.exports = mongoose.model("Product", productSchema);
