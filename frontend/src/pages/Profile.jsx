import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const Profile = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });
            if (response.data.success) {
                setUserData(response.data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("รหัสผ่านใหม่ไม่ตรงกันนะคู่หู!");
        }

        try {
            const response = await axios.post(`${backendUrl}/api/user/change-password`, 
                { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }, 
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("เปลี่ยนรหัสผ่านสำเร็จ!");
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setShowPasswordForm(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/update-profile`, 
                { name: userData.name, phone: userData.phone }, 
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("บันทึกข้อมูลสำเร็จ!");
                fetchUserData(); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
        setIsSubmitting(false);
    }
    
    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    useEffect(() => { if (token) fetchUserData() }, [token]);

    return (
        <div className='bg-[#0a0a0a] min-h-screen pt-14 px-4 pb-20 text-gray-300'>
            <div className='max-w-md mx-auto'>
                {/* Header Section */}
                <div className='text-3xl font-black mb-8 tracking-tight text-center'>
                    <span className='text-white'>ACCOUNT</span> <span className='text-[#D4AF37]'>SETTINGS</span>
                </div>

                <div className='bg-[#121212] p-8 rounded-2xl border border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-8'>
                    
                    {/* ส่วนที่ 1: ข้อมูลส่วนตัว */}
                    <form onSubmit={handleUpdate} className='flex flex-col gap-5'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='w-1.5 h-6 bg-[#D4AF37] rounded-full'></div>
                            <h3 className='text-lg font-bold text-white uppercase tracking-wider'>Personal Information</h3>
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black'>Email Address (Non-editable)</label>
                            <input disabled value={userData.email} className='bg-black/40 border border-gray-800 p-3 rounded-xl text-gray-500 cursor-not-allowed text-sm' type="email" />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black'>Full Name</label>
                            <input required value={userData.name} onChange={(e)=>setUserData({...userData, name: e.target.value})} className='bg-[#1a1a1a] border border-gray-700 focus:border-[#D4AF37] p-3 rounded-xl outline-none text-white text-sm transition-all' type="text" placeholder="Your Name" />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black'>Phone Number</label>
                            <input value={userData.phone} onChange={(e)=>setUserData({...userData, phone: e.target.value})} className='bg-[#1a1a1a] border border-gray-700 focus:border-[#D4AF37] p-3 rounded-xl outline-none text-white text-sm transition-all' type="text" placeholder="Your Phone" />
                        </div>

                        <button disabled={isSubmitting} type='submit' className='bg-[#D4AF37] text-black font-black py-3 rounded-xl mt-4 hover:bg-white transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.2)] uppercase text-xs tracking-[0.2em]'>
                            {isSubmitting ? 'SAVING CHANGES...' : 'SAVE PROFILE'}
                        </button>
                    </form>

                    {/* ส่วนที่ 2: เปลี่ยนรหัสผ่าน */}
                    <div className='border-t border-gray-800 pt-6'>
                        <button 
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className='flex items-center gap-2 text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:text-white transition-colors'
                        >
                            {showPasswordForm ? '✕ Hide Form' : '🔑 Security Settings'}
                        </button>

                        {showPasswordForm && (
                            <form onSubmit={handleChangePassword} className='flex flex-col gap-4 mt-6 animate-fadeIn'>
                                <div className='space-y-4'>
                                    <input 
                                        required 
                                        type="password" 
                                        placeholder='CURRENT PASSWORD' 
                                        className='w-full bg-black border border-gray-800 focus:border-[#D4AF37] p-3 rounded-xl text-xs outline-none text-white transition-all'
                                        value={passwords.oldPassword}
                                        onChange={(e)=>setPasswords({...passwords, oldPassword: e.target.value})}
                                    />
                                    <input 
                                        required 
                                        type="password" 
                                        placeholder='NEW PASSWORD (MIN 8 CHARS)' 
                                        className='w-full bg-black border border-gray-800 focus:border-[#D4AF37] p-3 rounded-xl text-xs outline-none text-white transition-all'
                                        value={passwords.newPassword}
                                        onChange={(e)=>setPasswords({...passwords, newPassword: e.target.value})}
                                    />
                                    <input 
                                        required 
                                        type="password" 
                                        placeholder='CONFIRM NEW PASSWORD' 
                                        className='w-full bg-black border border-gray-800 focus:border-[#D4AF37] p-3 rounded-xl text-xs outline-none text-white transition-all'
                                        value={passwords.confirmPassword}
                                        onChange={(e)=>setPasswords({...passwords, confirmPassword: e.target.value})}
                                    />
                                </div>
                                <button type='submit' className='bg-transparent border border-gray-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300'>
                                    Update Security Key
                                </button>
                            </form>
                        )}
                    </div>
                </div>
                
                {/* Logout Button (Optional for Profile Page) */}
                <p className='text-center mt-10 text-gray-600 text-[10px] tracking-widest uppercase'>
                    Gem Shop Secure Connection Active
                </p>
            </div>
        </div>
    )
}

export default Profile;