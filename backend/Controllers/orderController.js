import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// 1. ฟังก์ชันสั่งซื้อแบบปกติ (COD หรือ Bank Transfer)
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address, paymentMethod } = req.body;
        const userId = req.userId;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod,
            payment: false, // ยังไม่ได้ชำระเงิน
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // สั่งซื้อเสร็จแล้ว ล้างตะกร้าสินค้าของ User คนนี้ใน DB ด้วย
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 2. ฟังก์ชันจำลองการจ่ายเงินผ่าน Stripe (จ่ายสำเร็จทันที)
const placeOrderStripe = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;
        

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: true, // <--- จำลองว่าจ่ายเงินสำเร็จแล้ว
            status: "Ready to Ship", // 🔥 เพิ่มบรรทัดนี้ เพื่อแยกความต่างจาก COD/Bank
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // ล้างตะกร้าสินค้า
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Paid and Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// ฟังก์ชันสำหรับแนบสลิป (ย้ายมาจาก Route)
const uploadReceipt = async (req, res) => {
    try {
        const { orderId } = req.body;
        const imageFile = req.file.filename; // ชื่อไฟล์ที่ Multer บันทึก
        
        // ตรวจสอบว่ามีไฟล์ส่งมาไหม
        if (!req.file) {
            return res.json({ success: false, message: "ไม่พบไฟล์รูปภาพจ้า" });
        }

        const imagePath = req.file.path; 

        // อัปเดตข้อมูลในฐานข้อมูล
        await orderModel.findByIdAndUpdate(orderId, { 
            paymentReceipt: imageFile,       // บันทึกชื่อไฟล์ลงฟิลด์นี้
            status: 'Pending Verification',  // 🔥 เปลี่ยนสถานะเป็นตัวนี้!
            payment: false                    // (Optional) อาจจะมาร์คว่าจ่ายแล้วแต่รอตรวจ
        });

        res.json({ success: true, message: "ส่งหลักฐานการชำระเงินเรียบร้อย!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// ดึงรายการคำสั่งซื้อทั้งหมด (สำหรับ Admin)
const allOrders = async (req, res) => {
    try {
        // ดึงออเดอร์ทั้งหมดจาก DB และเรียงจากใหม่ไปเก่า
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// อัปเดตสถานะออเดอร์ และยืนยันการชำระเงิน (สำหรับ Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const updateData = { status };
        if (status !== 'Order Placed') {
            updateData.payment = true;
        }
        // ถ้าแอดมินเปลี่ยนสถานะเป็น 'Shipped' หรือ 'Delivered' 
        // เราอาจจะตั้งค่า payment: true ให้อัตโนมัติในกรณีที่เป็น Bank Transfer
        await orderModel.findByIdAndUpdate(orderId, updateData);
        
        res.json({ success: true, message: "Status & Payment Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const userOrders = async (req, res) => {
    try {
        // ต้องดึงจาก req.userId (ตามที่เราแก้ใน Middleware ล่าสุด)
        const userId = req.userId; 
        const orders = await orderModel.find({ userId });
        
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// อย่าลืม Export ออกไปใช้
export { placeOrder, placeOrderStripe, uploadReceipt, allOrders,updateStatus };