import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }
        
        // ถอดรหัส Token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // ตรวจสอบว่า Payload ใน Token ตรงกับ Admin Credentials หรือไม่
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }
        
        next(); // ถ้าถูกต้อง ให้ไปทำฟังก์ชันถัดไป (เช่น ดึงข้อมูลออเดอร์)
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth;