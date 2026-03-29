import React from 'react'

const Navbar = ({ setToken }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=DM+Sans:wght@500&display=swap');

        .luxury-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 4%;
          background: #0a0a0a;
          border-bottom: 1px solid #2a2318; /* เส้นขอบทองเข้มจางๆ */
          font-family: 'DM Sans', sans-serif;
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: #e8e0d0;
          letter-spacing: 0.1em;
        }

        .nav-logo span {
          color: #c9a84c; /* สีทองสำหรับคำว่า ADMIN */
          font-size: 14px;
          letter-spacing: 0.2em;
          margin-left: 8px;
          font-family: 'DM Sans', sans-serif;
          vertical-align: middle;
        }

        .logout-btn {
          background: transparent;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 8px 20px;
          border-radius: 2px; /* เปลี่ยนจากมนๆ เป็นเหลี่ยมให้ดูแพง */
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: #c9a84c;
          color: #0a0a0a;
        }
      `}</style>

      <div className='luxury-nav'>
        <p className='nav-logo'>
          GEM SHOP <span>ADMIN PANEL</span>
        </p>
        <button 
          onClick={() => setToken('')} 
          className='logout-btn'
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default Navbar