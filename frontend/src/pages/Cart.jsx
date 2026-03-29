import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, delivery_fee, getCartAmount, updateQuantity, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        tempData.push({
          _id: items,
          quantity: cartItems[items]
        });
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen border-t border-gray-900 pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] text-gray-300">
      
      {/* Title */}
      <div className="text-3xl font-black mb-10 tracking-tight">
        <span className="text-white">YOUR</span> <span className="text-[#D4AF37]">CART</span>
        <div className="w-16 h-1 bg-[#D4AF37] mt-2"></div>
      </div>
      
      {/* Table Header (Hidden on Mobile) */}
      <div className="hidden sm:grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4 pb-4 text-xs uppercase tracking-widest text-gray-500 font-bold border-b border-gray-800">
        <p>Products</p>
        <p className="text-center">Quantity</p>
        <p className="text-right">Action</p>
      </div>

      <div className="mt-4">
        {cartData.map((item) => {
          const productData = products.find((p) => (p._id || p.id) === item._id); 
          
          return (
            <div key={item._id} className="py-6 border-b border-gray-800/50 grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4 hover:bg-[#121212]/50 transition-colors">
              
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img className="w-20 sm:w-24 rounded-lg border border-gray-800 object-cover" src={productData?.image} alt="" />
                <div>
                  <p className="text-sm sm:text-lg font-bold text-white mb-1">{productData?.name}</p>
                  <p className="text-[#D4AF37] font-bold">{currency}{productData?.price?.toLocaleString()}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="flex items-center bg-black border border-gray-700 rounded-full overflow-hidden">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-[#D4AF37] hover:text-black transition-colors font-bold"
                  >-</button>
                  <p className="px-4 py-1 text-sm font-bold text-white min-w-[40px] text-center border-x border-gray-700">
                    {item.quantity}
                  </p>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-[#D4AF37] hover:text-black transition-colors font-bold"
                  >+</button>
                </div>
              </div>

              {/* Delete Button */}
              <div className="text-right">
                <button 
                  onClick={() => updateQuantity(item._id, 0)}
                  className="p-2 hover:bg-red-500/10 rounded-full group transition-all"
                  title="Remove Item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

            </div>
          )
        })}
      </div>

      {/* Cart Totals Section */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px] bg-[#121212] p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">ORDER <span className="text-[#D4AF37]">SUMMARY</span></h3>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-white font-medium">{currency}{getCartAmount().toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-500">Shipping Fee</span>
              <span className="text-white font-medium">{currency}{getCartAmount() === 0 ? 0 : delivery_fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-4 text-xl font-black">
              <span className="text-white">TOTAL</span>
              <span className="text-[#D4AF37]">{currency}{getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee).toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/place-order')} 
            className="w-full bg-[#D4AF37] text-black py-4 mt-8 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
          >
            Proceed to Checkout
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="w-full mt-4 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            — Continue Shopping —
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;