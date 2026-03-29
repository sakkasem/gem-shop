import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext'; // นำเข้า Context
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { getCartCount } = useContext(ShopContext);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg flex justify-between items-center">
        <Link to="/"> {/* ทำให้คลิกที่ชื่อร้านแล้วกลับหน้าแรก */}
          <h1 className="text-2xl font-bold text-blue-400 cursor-pointer">GEM SHOP</h1>
        </Link>
        
        <div className="space-x-6 flex items-center">
          <Link title="Home" to="/" className="cursor-pointer hover:text-blue-400">Home</Link>

           {/* แก้ตรงนี้: ใช้ Link เพื่อให้กดแล้วไปหน้า /cart */}
          <Link to="/Orders" className="cursor-pointer hover:text-blue-400 relative flex items-center">Orders</Link>

           {/* แก้ตรงนี้: ใช้ Link เพื่อให้กดแล้วไปหน้า /cart */}
          <Link to="/cart" className="cursor-pointer hover:text-blue-400 relative flex items-center">
            Cart 
            <span className="ml-1 bg-red-500 text-[10px] px-2 py-0.5 rounded-full">
              {getCartCount()}
            </span>
          </Link>

          {/* แก้ตรงนี้: ใช้ Link เพื่อให้กดแล้วไปหน้า /cart */}
          <Link to="/Profile" className="cursor-pointer hover:text-blue-400 relative flex items-center">Profile</Link>

          {/* --- ส่วนที่แก้ไข: เช็กเงื่อนไขการซ่อน/โชว์ปุ่ม --- */}
          {token ? (
            // ถ้ามี Token (ล็อกอินแล้ว) ให้โชว์ปุ่ม Logout
            <button 
              onClick={logout} 
              className="cursor-pointer hover:text-red-400 border border-red-400 px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            // ถ้าไม่มี Token ให้โชว์ปุ่ม Login ตามปกติ
            <Link to="/login" className="cursor-pointer hover:text-blue-400">Login/Sign Up</Link>
          )}
          
        </div>
      </nav>

      {/* กำหนดว่าแต่ละ URL จะโชว์หน้าไหน */}
      <Routes>
        <Route path="/" element={
          <>
            <header className="py-12 text-center bg-white border-b">
              <h2 className="text-4xl font-extrabold text-gray-800">ค้นหาสินค้าที่คุณต้องการ</h2>
              <p className="text-gray-500 mt-2">โปรเจกต์ระบบ E-commerce</p>
            </header>

            <main className="max-w-6xl mx-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((p) => (
                  <div key={p._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                    <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                      <p className="text-blue-600 font-bold mt-2">{p.price} บาท</p>
                      <button 
                        onClick={() => addToCart(p._id)} 
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        ใส่ตะกร้าสินค้า
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </>
        } />
        
        {/* เมื่อ URL เป็น /cart ให้แสดงหน้า Cart.jsx */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
        
    </div>
  );
}
export default Navbar;