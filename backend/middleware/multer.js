// backend/middleware/multer.js
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// ตรวจสอบและสร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads') // เก็บไว้ในโฟลเดอร์ uploads
    },
    filename: (req, file, cb) => {
        // ตั้งชื่อไฟล์ใหม่: วันที่-ชื่อไฟล์เดิม (เพื่อไม่ให้ชื่อซ้ำ)
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // จำกัดขนาด 10MB
})

export default upload