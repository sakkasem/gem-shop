import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ฟังก์ชันสร้าง Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// --- ฟังก์ชันดึงข้อมูลโปรไฟล์ ---
const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // ได้จาก middleware authUser
        const user = await userModel.findById(userId).select("-password");
        
        if (!user) {
            return res.json({ success: false, message: "ไม่พบข้อมูลผู้ใช้งาน" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // ดึง ID จาก token
        const { name, phone } = req.body; // userId ได้มาจาก authUser middleware

        if (!name) {
            return res.json({ success: false, message: "กรุณากรอกชื่อ" });
        }

        // อัปเดตข้อมูลโดยใช้ userId ที่ได้จาก Token
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            { name, phone }, 
            { new: true } // เพื่อให้คืนค่าข้อมูลที่อัปเดตแล้วกลับมา
        );

        if (!updatedUser) {
            return res.json({ success: false, message: "ไม่พบผู้ใช้งานในระบบ" });
        }

        res.json({ success: true, message: "อัปเดตโปรไฟล์สำเร็จ" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// ฟังก์ชัน Login และ Register เดิมของคุณ (สรุปย่อ)
// ฟังก์ชันสำหรับ Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ตรวจสอบว่ามี user นี้ไหม
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // ตรวจสอบรหัสผ่าน (ใช้ bcrypt เทียบค่า)
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// ฟังก์ชันสำหรับสมัครสมาชิก
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ตรวจสอบอีเมลซ้ำ
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // ตรวจสอบความถูกต้องของอีเมลและความแข็งแรงของรหัสผ่าน (Cybersecurity focus)
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phone: "" // เพิ่มค่าว่างไว้ตาม Schema ใหม่
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// เพิ่มฟังก์ชันนี้ใน userController.js
const changePassword = async (req, res) => {
    try {
        const userId = req.userId; 
        const { oldPassword, newPassword } = req.body;

        // 1. ต้องดึงข้อมูล user ออกมาก่อน ไม่งั้นจะใช้ user.password ไม่ได้ (จุดที่พลาด)
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "ไม่พบผู้ใช้งาน" });
        }

        // เช็ครหัสผ่านเก่า
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "รหัสผ่านเดิมไม่ถูกต้อง" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" });
        }

        // เข้ารหัสรหัสผ่านใหม่
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ฟังก์ชันดึงรายชื่อ User ทั้งหมดสำหรับ Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password"); // ดึงทุกฟิลด์ยกเว้น password
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}       

// ฟังก์ชันลบ User (ถ้าต้องการ)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        await userModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "ลบผู้ใช้งานเรียบร้อย" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// อย่าลืม export เพิ่ม และไปใส่ใน userRouter.post('/change-password', authUser, changePassword) ด้วยนะครับ
export { loginUser, registerUser, getProfile, updateProfile, changePassword, getAllUsers, deleteUser };