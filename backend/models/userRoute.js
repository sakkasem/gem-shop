import express from "express";
import { loginUser, registerUser, getProfile, updateProfile } from "../Controllers/userController.js";
import authUser from "../middleware/auth.js"; // อย่าลืมสร้างไฟล์ middleware ตรวจสอบ token

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Route สำหรับ Profile (ต้องผ่านการตรวจสอบสิทธิ์)
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, updateProfile);


export default userRouter;