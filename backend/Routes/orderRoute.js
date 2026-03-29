import express from 'express';
import multer from 'multer';
import { placeOrder, placeOrderStripe, uploadReceipt,userOrders } from '../Controllers/orderController.js';
import authUser from '../middleware/auth.js'; // อย่าลืมใส่ Middleware เช็ค Token นะ
import adminAuth from '../middleware/adminAuth.js';
import { allOrders, updateStatus } from '../Controllers/orderController.js';

const orderRouter = express.Router();
// ตั้งค่า Multer
const upload = multer({ dest: 'uploads/' }); 

// API สำหรับอัปโหลดสลิป (ใช้ Router แทน app)
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/userorders', authUser, userOrders); // 🔥 เพิ่มบรรทัดนี้!
orderRouter.post("/upload-receipt", authUser, upload.single('image'), uploadReceipt);
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

export default orderRouter;