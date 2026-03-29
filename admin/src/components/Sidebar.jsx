import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

        .horizontal-nav {
          width: 100%;
          background: #0d0d0d;
          border-bottom: 1px solid #2a2318;
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .nav-list {
          display: flex;
          align-items: center;
          justify-content: center; /* จัดเมนูไว้ตรงกลาง */
          gap: 1.5rem;
          padding: 0 4%;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 15px 20px;
          color: #6b6459;
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-item:hover {
          color: #e8e0d0;
        }

        /* เอฟเฟกต์เส้นใต้เมื่อเมนู Active */
        .nav-item.active {
          color: #c9a84c;
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #c9a84c;
        }

        .menu-icon {
          font-size: 16px;
        }

        .nav-divider {
          width: 1px;
          height: 20px;
          background: #2a2318;
        }

        @media (max-width: 640px) {
          .nav-list { gap: 0.5rem; overflow-x: auto; justify-content: flex-start; }
          .nav-item { padding: 12px 10px; font-size: 10px; flex-shrink: 0; }
        }
      `}</style>

      <div className='horizontal-nav'>
        <div className='nav-list'>
          
          <NavLink to="/add" className="nav-item">
            <span className="menu-icon">⊕</span>
            <p>Add Items</p>
          </NavLink>

          <NavLink to="/list" className="nav-item">
            <span className="menu-icon">▤</span>
            <p>List Items</p>
          </NavLink>

          <NavLink to="/orders" className="nav-item">
            <span className="menu-icon">📦</span>
            <p>Orders</p>
          </NavLink>

          <div className="nav-divider"></div>

          <NavLink to="/add-coupon" className="nav-item">
            <span className="menu-icon">🎫</span>
            <p>Add Coupon</p>
          </NavLink>

          <NavLink to="/list-coupon" className="nav-item">
            <span className="menu-icon">📜</span>
            <p>List Coupons</p>
          </NavLink>

         

        </div>
      </div>
    </>
  )
}

export default Sidebar