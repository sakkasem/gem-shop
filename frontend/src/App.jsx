import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from './context/ShopContext';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
  const { products, addToCart, getCartCount } = useContext(ShopContext);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  

useEffect(() => {
  localStorage.setItem('token', token);
}, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    window.location.href = '/login';
  };

  return (
    // พื้นหลังหลักเปลี่ยนเป็นสีดำเข้ม
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans">
      <ToastContainer theme="dark" />
      
      {/* Navbar: ดำเงา ขอบทองล่าง */}
      <nav className="bg-[#121212] border-b border-[#D4AF37]/30 text-white p-5 sticky top-0 z-50 shadow-2xl flex justify-between items-center backdrop-blur-md bg-opacity-90">
        <Link to="/">
          <h1 className="text-3xl font-black tracking-tighter text-[#D4AF37] hover:scale-105 transition-transform cursor-pointer">
            GEM <span className="text-white">SHOP</span>
          </h1>
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center font-medium uppercase text-xs tracking-widest">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          {token && (
            <>
              <Link to="/orders" className="hover:text-[#D4AF37] transition-colors">Orders</Link>
              <Link to="/profile" className="hover:text-[#D4AF37] transition-colors">Profile</Link>
              <Link to="/cart" className="relative group">
                <span className="hover:text-[#D4AF37] transition-colors">Cart</span>
                <span className="absolute -top-3 -right-4 bg-[#D4AF37] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                  {getCartCount()}
                </span>
              </Link>
            </>
          )}
          
          {token ? (
            <button 
              onClick={logout} 
              className="ml-4 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-5 py-2 rounded-full transition-all duration-300 font-bold"
            >
              LOGOUT
            </button>
          ) : (
            <Link to="/login" className="bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold hover:bg-[#b8962e] transition-colors">
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <>
            {/* Header Section */}
            <header className="py-20 text-center bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
              <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
                THE <span className="text-[#D4AF37]">LUXURY</span> COLLECTION
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-4"></div>
              <p className="text-gray-500 max-w-lg mx-auto italic">สัมผัสประสบการณ์การช้อปปิ้งระดับพรีเมียมไปกับ GEM SHOP</p>
            </header>

            {/* Product Grid */}
            <main className="max-w-7xl mx-auto p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                
                {products?.map((p) => (
                  <div key={p._id} className="group bg-[#161616] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
                    <div className="relative overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">New Arrival</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">{p.name}</h3>
                      <p className="text-[#D4AF37] font-black text-xl mt-3">
                        {p.price.toLocaleString()} <span className="text-sm font-normal">THB</span>
                      </p>
                      
                      <button 
                        onClick={() => addToCart(p._id)} 
                        className="w-full mt-6 bg-transparent border border-gray-700 text-white py-3 rounded-xl group-hover:bg-[#D4AF37] group-hover:text-black group-hover:border-[#D4AF37] transition-all duration-300 font-black uppercase text-xs tracking-widest"
                      >
                        Add to Collection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </>
        } />
        
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

      {/* Footer เล็กๆ เพื่อความจบงาน */}
      <footer className="py-10 text-center text-gray-600 text-xs uppercase tracking-[0.2em] border-t border-gray-900 mt-20">
        &copy; 2026 GEM SHOP - THE ULTIMATE EXPERIENCE
      </footer>
    </div>
  );
}

export default App;