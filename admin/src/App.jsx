import React, { useState, useEffect } from 'react'
import Navbar from "./components/Navbar.jsx"; // เติม .jsx เข้าไป
import Sidebar from "./components/Sidebar.jsx"; // เติม .jsx เข้าไป
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// เพิ่มบรรทัดนี้ที่ด้านบนของ App.jsx
import AddCoupon from './pages/AddCoupon' // เช็ค Path ให้ตรงกับที่คุณเซฟไฟล์ไว้
import ListCoupon from './pages/ListCoupon' 


export const backendUrl = 'http://localhost:4000' // ห้ามมี / ปิดท้าย

const App = () => {
  
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<List token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/add-coupon' element={<AddCoupon backendUrl={backendUrl} token={token} />} />
                <Route path='/list-coupon' element={<ListCoupon backendUrl={backendUrl} token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App