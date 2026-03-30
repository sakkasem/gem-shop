import express from "express";
import { loginUser, registerUser, getProfile, updateProfile, getAllUsers, 
    deleteUser, 
    changePassword } from "../Controllers/userController.js";
import authUser from "../middleware/auth.js"; // อย่าลืมสร้างไฟล์ middleware ตรวจสอบ token
import adminAuth from "../middleware/adminAuth.js";

const userroute = express.Router();

userroute.post("/register", registerUser);
userroute.post("/login", loginUser);
// Route สำหรับ Profile (ต้องผ่านการตรวจสอบสิทธิ์)
userroute.get("/get-profile", authUser, getProfile);
userroute.post("/update-profile", authUser, updateProfile);
userroute.post("/change-password", authUser, changePassword); // เพิ่มเส้นทางเปลี่ยนรหัสผ่าน

userroute.get("/all-users", adminAuth, getAllUsers);
userroute.post("/delete-user", adminAuth, deleteUser);

export default userroute;