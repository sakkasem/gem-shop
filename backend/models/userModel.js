import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique: true เพื่อไม่ให้ใช้อีเมลซ้ำกัน
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    cartData: { type: Object, default: {} }, // เก็บข้อมูลตะกร้าสินค้าของ User คนนี้ไว้ใน DB เลย
    resetPasswordOtp: { type: String, default: null },
}, { minimize: false }); // minimize: false เพื่อให้ยอมรับ Object ว่างๆ ใน cartData

// ถ้ามี Model User อยู่แล้วให้ใช้ของเดิม ถ้าไม่มีให้สร้างใหม่
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;