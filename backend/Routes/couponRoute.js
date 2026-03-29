// backend/routes/couponRoute.js
import express from 'express';
import { addCoupon, validateCoupon, listCoupons, removeCoupon } from '../Controllers/couponController.js';
import adminAuth from '../middleware/adminAuth.js';


const couponRouter = express.Router();

couponRouter.post('/add', adminAuth, addCoupon); // เฉพาะ Admin
couponRouter.post('/validate', validateCoupon); // ลูกค้าใช้เช็ค
couponRouter.get('/list', adminAuth, listCoupons); // ต้องใช้ฟังก์ชันจาก controller ไม่ใช่ไฟล์หน้าจอ
couponRouter.post('/remove', adminAuth, removeCoupon);

export default couponRouter;