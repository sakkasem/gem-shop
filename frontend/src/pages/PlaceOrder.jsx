import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const { currency, delivery_fee, getCartAmount, backendUrl, token, cartItems, setCartItems, products } = useContext(ShopContext);
    
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [method, setMethod] = useState('cod');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(data => ({ ...data, [name]: value }))
    }

    const handleApplyCoupon = async () => {
        if (!couponCode) return toast.info("กรุณากรอกรหัสคูปอง");
        try {
            const response = await axios.post(`${backendUrl}/api/coupon/validate`, { code: couponCode });
            if (response.data.success) {
                setAppliedDiscount(response.data.discount);
                toast.success(`Luxury Discount Applied: -${currency}${response.data.discount}`);
            } else {
                toast.error(response.data.message);
                setAppliedDiscount(0);
            }
        } catch (error) {
            toast.error("Coupon system is currently unavailable");
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (getCartAmount() === 0) {
            return toast.error("ตะกร้าสินค้าว่างเปล่า");
        }

        try {
            let orderItems = [];

            for (const items in cartItems) {
                if (cartItems[items] > 0) {
                    const itemInfo = structuredClone(products.find(product => (product._id || product.id) === items));
                    if (itemInfo) {
                        itemInfo.quantity = cartItems[items];
                        orderItems.push(itemInfo);
                    }
                }
            }

            // คำนวณยอดสุทธิ (ยอดรวม + ค่าส่ง - ส่วนลด)
            const finalAmount = getCartAmount() + delivery_fee - appliedDiscount;

            let orderData = {
                address: formData,
                items: orderItems,
                amount: finalAmount > 0 ? finalAmount : 0, // ป้องกันยอดติดลบ
                paymentMethod: method,
                coupon: appliedDiscount > 0 ? couponCode : null
            }

            // --- API Logic ---
            let response;
            switch (method) {
                case 'stripe':
                    response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
                    break;
                case 'bank':
                case 'cod':
                default:
                    response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
                    break;
            }

            if (response.data.success) {
                setCartItems({});
                toast.success("Order Placed Successfully!");
                navigate('/orders');
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error("An error occurred while processing your order");
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='bg-[#121212] min-h-screen pt-14 pb-20 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex flex-col lg:flex-row justify-between gap-12 text-gray-300'>
            
            {/* Left Side: Delivery Info */}
            <div className='flex flex-col gap-6 w-full lg:max-w-[480px]'>
                <h2 className='text-3xl font-bold text-white mb-4'>DELIVERY <span className='text-[#D4AF37]'>INFO</span></h2>
                
                <div className='flex gap-3'>
                    <input required name='firstName' onChange={onChangeHandler} value={formData.firstName} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="text" placeholder='First Name' />
                    <input required name='lastName' onChange={onChangeHandler} value={formData.lastName} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="text" placeholder='Last Name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={formData.email} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="email" placeholder='Email Address' />
                <input required name='street' onChange={onChangeHandler} value={formData.street} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="text" placeholder='Street Address' />
                
                <div className='flex gap-3'>
                    <input required name='city' onChange={onChangeHandler} value={formData.city} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={formData.state} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="text" placeholder='State / Province' />
                </div>
                
                <div className='flex gap-3'>
                    <input required name='zipcode' onChange={onChangeHandler} value={formData.zipcode} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="number" placeholder='Zipcode' />
                    <input required name='country' onChange={onChangeHandler} value={formData.country} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="text" placeholder='Country' />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={formData.phone} className='bg-[#1c1c1c] border border-gray-800 w-full px-4 py-3 rounded-xl focus:border-[#D4AF37] outline-none transition' type="number" placeholder='Phone Number' />
            </div>

            {/* Right Side: Order Summary & Payment */}
            <div className='flex-1 lg:max-w-[500px]'>
                <div className='bg-[#1c1c1c] p-8 rounded-3xl border border-gray-800 shadow-2xl'>
                    <h3 className='text-2xl font-bold mb-8 text-white'>CART <span className='text-[#D4AF37]'>TOTALS</span></h3>
                    
                    {/* Coupon Section */}
                    <div className='mb-8 p-4 bg-[#121212] rounded-2xl border border-dashed border-gray-700'>
                        <p className='text-xs font-bold text-[#D4AF37] mb-3 uppercase tracking-widest'>Have a coupon?</p>
                        <div className='flex gap-2'>
                            <input 
                                type="text" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder='Enter Code'
                                className='bg-transparent border border-gray-800 text-white w-full px-4 py-2 rounded-lg focus:border-[#D4AF37] outline-none text-sm'
                            />
                            <button 
                                type='button' 
                                onClick={handleApplyCoupon}
                                className='bg-[#D4AF37] text-black px-6 py-2 rounded-lg font-bold text-xs hover:bg-[#b8962e] transition'
                            >
                                APPLY
                            </button>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className='space-y-4 text-sm'>
                        <div className='flex justify-between text-gray-400'>
                            <p>Subtotal</p>
                            <p>{currency}{getCartAmount().toLocaleString()}.00</p>
                        </div>
                        {appliedDiscount > 0 && (
                            <div className='flex justify-between text-[#D4AF37] font-medium italic'>
                                <p>Coupon Discount</p>
                                <p>- {currency}{appliedDiscount.toLocaleString()}.00</p>
                            </div>
                        )}
                        <div className='flex justify-between text-gray-400'>
                            <p>Shipping Fee</p>
                            <p>{currency}{delivery_fee.toLocaleString()}.00</p>
                        </div>
                        <hr className='border-gray-800 my-2' />
                        <div className='flex justify-between text-xl font-bold text-white'>
                            <p>Total</p>
                            <p className='text-[#D4AF37]'>{currency}{(getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee - appliedDiscount)).toLocaleString()}.00</p>
                        </div>
                    </div>

                    {/* Payment Selection */}
                    <div className='mt-12'>
                        <p className='text-xs font-bold text-gray-500 mb-5 uppercase tracking-tighter'>Payment Method</p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition ${method === 'stripe' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-800 hover:border-gray-700'}`}>
                                <div className={`w-3 h-3 rounded-full ${method === 'stripe' ? 'bg-[#D4AF37]' : 'border border-gray-600'}`}></div>
                                <p className='text-xs font-bold text-white uppercase'>Stripe</p>
                            </div>
                            <div onClick={() => setMethod('bank')} className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition ${method === 'bank' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-800 hover:border-gray-700'}`}>
                                <div className={`w-3 h-3 rounded-full ${method === 'bank' ? 'bg-[#D4AF37]' : 'border border-gray-600'}`}></div>
                                <p className='text-xs font-bold text-white uppercase'>Bank Transfer</p>
                            </div>
                            <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition ${method === 'cod' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-800 hover:border-gray-700'}`}>
                                <div className={`w-3 h-3 rounded-full ${method === 'cod' ? 'bg-[#D4AF37]' : 'border border-gray-600'}`}></div>
                                <p className='text-xs font-bold text-white uppercase'>Cash on Delivery</p>
                            </div>
                        </div>
                    </div>

                    <button type='submit' className='w-full bg-[#D4AF37] text-black font-black py-4 mt-10 rounded-xl hover:bg-[#b8962e] active:scale-95 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.2)] uppercase tracking-widest'>
                        FINALIZE ORDER
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder;