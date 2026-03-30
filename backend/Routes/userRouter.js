import express from "express";
import { loginUser, registerUser, getProfile, updateProfile, getAllUsers, 
    deleteUser, 
    changePassword } from "../Controllers/userController.js";
import authUser from "../middleware/auth.js"; // อย่าลืมสร้างไฟล์ middleware ตรวจสอบ token
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
// Route สำหรับ Profile (ต้องผ่านการตรวจสอบสิทธิ์)
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, updateProfile);
userRouter.post("/change-password", authUser, changePassword); // เพิ่มเส้นทางเปลี่ยนรหัสผ่าน

userRouter.get("/all-users", adminAuth, getAllUsers);
userRouter.post("/delete-user", adminAuth, deleteUser);

export default userRouter;