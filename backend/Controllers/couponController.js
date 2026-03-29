import couponModel from "../models/Coupon.js";

// Admin: สร้างคูปองใหม่
const addCoupon = async (req, res) => {
    try {
        const { code, discount, expiryDate } = req.body;
        const newCoupon = new couponModel({ code: code.toUpperCase(), discount, expiryDate });
        await newCoupon.save();
        res.json({ success: true, message: "สร้างคูปองสำเร็จ" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Customer: ตรวจสอบคูปองว่าใช้ได้ไหม
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await couponModel.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.json({ success: false, message: "ไม่พบคูปองนี้" });
        }

        if (new Date() > new Date(coupon.expiryDate)) {
            return res.json({ success: false, message: "คูปองนี้หมดอายุแล้ว" });
        }

        res.json({ success: true, discount: coupon.discount });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ฟังก์ชันสำหรับดึงรายการคูปองทั้งหมด
const listCoupons = async (req, res) => {
    try {
        // ดึงข้อมูลคูปองทั้งหมดจาก Database (เรียงจากใหม่ไปเก่า)
        const coupons = await couponModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, list: coupons });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// ฟังก์ชันสำหรับลบคูปอง
const removeCoupon = async (req, res) => {
    try {
        // รับ id จาก request body แล้วสั่งลบในฐานข้อมูล
        await couponModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "ลบคูปองสำเร็จ" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addCoupon, validateCoupon, listCoupons, removeCoupon }