import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import mongoose from "mongoose"; // เพิ่มตัวนี้
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dns from "dns/promises"
import nodemailer from 'nodemailer';
import User from './models/userModel.js';
import Product from "./models/Product.js";
import orderModel from './models/orderModel.js';
import authUser from './middleware/auth.js'; // 🔥 เพิ่มบรรทัดนี้เข้ามา!
import orderRouter from './Routes/orderRoute.js'; // มั่นใจว่า path ตรงกับโฟลเดอร์ในรูปนะ
import productRouter from './Routes/productRoute.js'
import couponRouter from './Routes/couponRoute.js'
import userRouter from "./routes/userRouter.js";

dns.setServers(['8.8.8.8','1.1.1.1'])

const app = express();
const port = process.env.port || 4000;

// ตั้งค่าตัวส่งอีเมล (ตัวอย่างใช้ Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nottvsakkazem@gmail.com', // อีเมลของคุณ
        pass: 'vtalpwdigwyopivh'    // App Password จาก Google
    }
});

// เชื่อมต่อ MongoDB (ต้องมีเพื่อให้เก็บข้อมูลสินค้า/สมาชิกได้)
mongoose.connect(process.env.Mongo_url)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
// server.js
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        // บังคับให้ Browser มองทุกไฟล์ในโฟลเดอร์นี้เป็นรูปภาพ PNG (หรือ JPG)
        // เพื่อให้มันยอมเปิดโชว์แทนการดาวน์โหลด
        res.setHeader('Content-Type', 'image/png'); 
    }
}));
app.use('/api/order', orderRouter);
app.use('/api/product', productRouter);
app.use('/api/coupon', couponRouter)
app.use("/api/user", userRouter);


// Route ทดสอบ
app.get("/", (req, res) => {
    res.send("E-commerce API is running...");
});

// API สำหรับ Admin Login (ดึงข้อมูลจาก .env)
app.post("/api/user/admin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // เช็คว่า Email และ Password ตรงกับใน .env ไหม
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // สร้าง Token พิเศษสำหรับ Admin
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "อีเมลหรือรหัสผ่านแอดมินไม่ถูกต้อง" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));

// เพิ่มไว้ต่อจาก app.use(cors(...))
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}); // ดึงข้อมูลทั้งหมดจากคอลเลกชัน Product
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
  }
});

// API สำหรับสมัครสมาชิก
app.post("/api/user/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. เช็กว่ามี User นี้อยู่ในระบบหรือยัง
        const exists = await User.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        // 2. เข้ารหัส Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. บันทึกลง MongoDB
        const newUser = new User({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // 4. สร้าง Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key');

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

// API สำหรับเข้าสู่ระบบ (Login)
app.post("/api/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. ค้นหา User ด้วย Email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "ไม่พบผู้ใช้งานนี้ในระบบ" });
        }

        // 2. ตรวจสอบรหัสผ่าน (เทียบรหัสที่พิมพ์มา กับรหัสที่เข้ารหัสไว้ใน DB)
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // 3. ถ้ารหัสถูกต้อง ให้สร้าง Token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});



// 1. API สำหรับอัปเดตตะกร้าสินค้า
app.post("/api/cart/update", authUser, async (req, res) => {
    try {
        const { userId, cartData } = req.body;
        await User.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// 2. API สำหรับดึงข้อมูลตะกร้าจาก DB
app.post("/api/cart/get", authUser, async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await User.findById(userId);
        res.json({ success: true, cartData: userData.cartData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// API สำหรับอัปเดตข้อมูลส่วนตัว
app.post("/api/user/update-profile", authUser, async (req, res) => {
    try {
        const { userId, name, phone } = req.body; // userId ได้จาก Middleware authUser

        if (!name) {
            return res.json({ success: false, message: "กรุณากรอกชื่อด้วยนะจ๊ะ" });
        }

        // อัปเดตข้อมูลใน MongoDB
        await User.findByIdAndUpdate(userId, { name, phone });

        res.json({ success: true, message: "อัปเดตโปรไฟล์สำเร็จแล้ว!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

app.post("/api/user/change-password", authUser, async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        // 1. ตรวจสอบรหัสผ่านเก่าว่าถูกต้องไหม
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "รหัสผ่านเดิมไม่ถูกต้องจ้ะ" });
        }

        // 2. ตรวจสอบความยาวรหัสใหม่ (เช่น ต้อง 8 ตัวขึ้นไป)
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวนะ" });
        }

        // 3. Hash รหัสผ่านใหม่และบันทึก
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จแล้วครับคู่หู!" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// API 1: รับอีเมลเพื่อส่งรหัส OTP
app.post("/api/user/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "ไม่พบอีเมลนี้ในระบบครับ" });
        }

        // สร้าง OTP 6 หลัก
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // บันทึก OTP ลงใน User Model ชั่วคราว (ควรตั้งเวลาหมดอายุด้วย)
        user.resetPasswordOtp = otp;
        await user.save();

        // ส่งอีเมล
        const mailOptions = {
            from: 'Gem Shop <your-email@gmail.com>',
            to: email,
            subject: 'รหัสรีเซ็ตรหัสผ่านจาก Gem Shop',
            text: `รหัส OTP สำหรับรีเซ็ตรหัสผ่านของคุณคือ: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "ส่งรหัส OTP ไปที่อีเมลเรียบร้อยแล้วจ้ะ" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.post("/api/user/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // 1. หา User จาก Email ก่อน
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "ไม่พบผู้ใช้งานอีเมลนี้ในระบบ" });
        }

        if (!user.resetPasswordOtp || String(user.resetPasswordOtp) !== String(otp)) {
            return res.json({ success: false, message: "รหัส OTP ไม่ถูกต้อง" });
        }

        // 3. ตรวจสอบความแรงของรหัสผ่านใหม่ (Optional แต่แนะนำ)
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวนะจ๊ะ" });
        }

        // 4. Hash รหัสใหม่
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 5. อัปเดตข้อมูลและล้าง OTP
        user.password = hashedPassword;
        user.resetPasswordOtp = null; 
        await user.save();

        res.json({ success: true, message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว เข้าสู่ระบบได้เลย!" });

    } catch (error) {
        console.log("Reset Password Error:", error);
        res.json({ success: false, message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
}); 
