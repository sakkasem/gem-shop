// backend/routes/productRoute.js
import express from 'express'
import { addProduct, listProducts, removeProduct } from '../Controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'

const productRouter = express.Router();

// รับข้อมูลสินค้าพร้อมรูปภาพ 'image1' (ส่งรูปเดียว)
productRouter.post('/add', upload.single('image1'), addProduct);
productRouter.get('/list', listProducts);
// เพิ่มบรรทัดนี้ในไฟล์ productRoute.js
productRouter.post('/remove', adminAuth, removeProduct);


export default productRouter;