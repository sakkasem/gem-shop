import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- State สำหรับ Forgot Password ---
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);

  const onForgotHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (response.data.success) {
        toast.success("ส่งรหัส OTP ไปที่อีเมลเรียบร้อยแล้ว!");
        setStep(2);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งอีเมล");
    }
  }

  const onResetHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, { email, otp, newPassword });
      if (response.data.success) {
        toast.success("เปลี่ยนรหัสผ่านสำเร็จ! เข้าสู่ระบบได้เลย");
        setShowForgot(false);
        setStep(1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("รหัส OTP ไม่ถูกต้องหรือเกิดข้อผิดพลาด");
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          toast.success("สมัครสมาชิกสำเร็จ!");
          setCurrentState('Login');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          toast.success("ยินดีต้อนรับกลับเข้าสู่ระบบ");
          navigate('/');
          window.location.reload();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  // --- UI สำหรับ Reset Password ---
  if (showForgot) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#121212] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl border border-gray-800 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">RESET <span className='text-[#D4AF37]'>PASS</span></h2>
            <div className='w-12 h-1 bg-[#D4AF37] mx-auto mt-2'></div>
          </div>

          {step === 1 ? (
            <form onSubmit={onForgotHandler} className='w-full flex flex-col gap-5'>
              <p className='text-xs text-gray-500 text-center italic'>กรอกอีเมลเพื่อรับรหัสรักษาความปลอดภัย</p>
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:border-[#D4AF37] outline-none transition-all text-sm" 
                placeholder="YOUR EMAIL" 
                required 
              />
              <button className='bg-[#D4AF37] text-black font-black py-3 rounded-xl hover:bg-white transition-all duration-300 uppercase tracking-widest text-xs'>SEND OTP</button>
              <p onClick={() => setShowForgot(false)} className='text-center text-[10px] text-gray-600 cursor-pointer hover:text-white uppercase tracking-widest transition-colors'>Back to Login</p>
            </form>
          ) : (
            <form onSubmit={onResetHandler} className='w-full flex flex-col gap-5'>
              <input 
                onChange={(e) => setOtp(e.target.value)} 
                value={otp} 
                type="text" 
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:border-[#D4AF37] outline-none text-center tracking-[1em] font-bold" 
                placeholder="000000" 
                required 
              />
              <input 
                onChange={(e) => setNewPassword(e.target.value)} 
                value={newPassword} 
                type="password" 
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:border-[#D4AF37] outline-none text-sm" 
                placeholder="NEW PASSWORD" 
                required 
              />
              <button className='bg-[#D4AF37] text-black font-black py-3 rounded-xl hover:bg-white transition-all duration-300 uppercase tracking-widest text-xs'>RESET PASSWORD</button>
              <p onClick={() => setStep(1)} className='text-center text-[10px] text-gray-600 cursor-pointer hover:text-white uppercase tracking-widest transition-colors'>Resend OTP?</p>
            </form>
          )}
        </div>
      </div>
    )
  }

  // --- UI สำหรับ Login / Sign Up ---
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmitHandler} className="w-full max-w-md bg-[#121212] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl border border-gray-800 flex flex-col gap-6 items-center">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{currentState}</h2>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {currentState !== 'Login' && (
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:border-[#D4AF37] outline-none transition-all text-sm" 
            placeholder="FULL NAME" 
            required 
          />
        )}
        
        <input 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          type="email" 
          className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:border-[#D4AF37] outline-none transition-all text-sm" 
          placeholder="EMAIL ADDRESS" 
          required 
        />
        
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          type="password" 
          className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:border-[#D4AF37] outline-none transition-all text-sm" 
          placeholder="PASSWORD" 
          required 
        />

        <div className="w-full flex justify-between text-[10px] font-bold uppercase tracking-widest mt-[-4px]">
          <p onClick={() => setShowForgot(true)} className="cursor-pointer text-gray-500 hover:text-[#D4AF37] transition-colors italic">Forgot password?</p>
          
          {currentState === 'Login' 
            ? <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer text-[#D4AF37] hover:text-white transition-colors underline underline-offset-4">Create account</p>
            : <p onClick={() => setCurrentState('Login')} className="cursor-pointer text-[#D4AF37] hover:text-white transition-colors underline underline-offset-4">Login Here</p>
          }
        </div>

        <button className="bg-[#D4AF37] text-black font-black py-4 mt-4 rounded-xl active:scale-95 transition-all w-full uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(212,175,55,0.15)]">
          {currentState === 'Login' ? 'Sign In' : 'Join Membership'}
        </button>

        <p className="text-[9px] text-gray-700 tracking-[0.3em] uppercase mt-4">Gem Shop Secure Authentication</p>
      </form>
    </div>
  );
};

export default Login;