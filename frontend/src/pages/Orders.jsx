import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);

    const loadOrderData = async () => {
        try {
            if (!token) return null;
            const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });
            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['orderId'] = order._id;
                        item['status'] = order.status;
                        item['payment'] = order.payment;
                        item['paymentMethod'] = order.paymentMethod;
                        item['date'] = order.date;
                        allOrdersItem.push(item);
                    });
                });
                setOrderData(allOrdersItem.reverse());
            }
        } catch (error) {
            console.log(error);
        }
    }

    const uploadReceipt = async (orderId) => {
        try {
            if (!image) return alert("กรุณาเลือกรูปภาพสลิปก่อนนะจ๊ะ");
            const formData = new FormData();
            formData.append('orderId', orderId);
            formData.append('image', image);

            const response = await axios.post(`${backendUrl}/api/order/upload-receipt`, formData, { headers: { token } });

            if (response.data.success) {
                alert("แนบสลิปสำเร็จ! รอแอดมินตรวจสอบนะครับ");
                setImage(null);
                loadOrderData();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการอัปโหลด");
        }
    }

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token]);

    useEffect(() => {
        loadOrderData();
    }, [token]);

    return (
        <div className='bg-[#0a0a0a] min-h-screen border-t border-gray-900 pt-16 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] text-gray-300'>
            
            <div className='text-3xl font-black mb-10 tracking-tight'>
                <span className='text-white'>MY</span> <span className='text-[#D4AF37]'>ORDERS</span>
                <div className='w-16 h-1 bg-[#D4AF37] mt-2'></div>
            </div>

            <div className='space-y-4'>
                {orderData.map((item, index) => (
                    <div key={index} className='p-6 bg-[#121212] rounded-2xl border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-300 shadow-xl'>
                        
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                            <div className='flex items-start gap-6'>
                                <img className='w-20 sm:w-24 rounded-lg object-cover border border-gray-700' src={item.image || item.img} alt="" />
                                <div className='space-y-1'>
                                    <p className='text-lg font-bold text-white'>{item.name}</p>
                                    <div className='flex items-center gap-4 text-sm'>
                                        <p className='text-[#D4AF37] font-bold text-lg'>{currency}{item.price.toLocaleString()}</p>
                                        <p className='text-gray-500'>Qty: {item.quantity}</p>
                                    </div>
                                    <div className='text-[12px] uppercase tracking-widest text-gray-500 pt-2'>
                                        <p>Placed on: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                        <p>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='md:w-1/3 flex flex-col sm:flex-row items-center justify-between gap-4'>
                                <div className='flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-gray-800'>
                                    <p className={`w-2 h-2 rounded-full ${
                                        item.status === 'Pending Verification' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' 
                                        : item.payment ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                                        : 'bg-orange-500'
                                    }`}></p>
                                    <p className='text-xs font-bold uppercase tracking-widest'>{item.status}</p>
                                </div>
                                <button 
                                    onClick={loadOrderData} 
                                    className='w-full sm:w-auto border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-6 py-2 text-xs font-black rounded-full transition-all duration-300'
                                >
                                    TRACK ORDER
                                </button>
                            </div>
                        </div>

                        {/* --- ส่วนการแนบสลิป ดีไซน์ใหม่ --- */}
                        {(item.paymentMethod === 'bank') && !item.payment && (
                            <div className='mt-6 p-5 bg-gradient-to-r from-[#1a1a1a] to-[#121212] rounded-xl border border-[#D4AF37]/20 flex flex-col lg:flex-row items-center justify-between gap-6'>
                                <div className='text-center lg:text-left'>
                                    <p className='font-bold text-[#D4AF37] text-sm uppercase tracking-widest mb-1'>Payment Required</p>
                                    <p className='text-xs text-gray-500 italic'>Please upload your transfer slip to finalize your order.</p>
                                </div>
                                
                                <div className='flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto'>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => setImage(e.target.files[0])}
                                        className='text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-800 file:text-[#D4AF37] hover:file:bg-gray-700 cursor-pointer'
                                    />
                                    <button 
                                        onClick={() => uploadReceipt(item.orderId)} 
                                        className='w-full sm:w-auto bg-[#D4AF37] text-black px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300 shadow-lg'
                                    >
                                        Submit Slip
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders