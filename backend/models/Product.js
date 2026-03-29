import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // เก็บเป็น URL รูปภาพ
  category: { type: String },
  countInStock: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);