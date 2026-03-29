import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // รหัสคูปอง เช่น SAVE10
    discount: { type: Number, required: true },          // ส่วนลด (เป็น % หรือ บาท)
    expiryDate: { type: Date, required: true },         // วันหมดอายุ
    isActive: { type: Boolean, default: true }           // สถานะเปิด/ปิดใช้งาน
})

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;