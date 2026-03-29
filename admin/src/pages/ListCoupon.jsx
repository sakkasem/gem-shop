import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const ListCoupon = ({ backendUrl, token }) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/coupon/list', { headers: { token } })
      if (response.data.success) {
        setList(response.data.list);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล")
    }
  }

  const removeCoupon = async (id) => {
    try {
      if (window.confirm("คุณต้องการลบคูปองนี้ใช่หรือไม่?")) {
        const response = await axios.post(backendUrl + '/api/coupon/remove', { id }, { headers: { token } })
        
        if (response.data.success) {
          toast.success(response.data.message)
          await fetchList();
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("ไม่สามารถลบคูปองได้")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .coupon-wrap {
          background: #0a0a0a;
          min-height: 100vh;
          padding: 2.5rem;
          font-family: 'DM Sans', sans-serif;
          color: #e8e0d0;
        }

        .coupon-accent-line {
          width: 40px;
          height: 2px;
          background: #c9a84c;
          margin-bottom: 1rem;
        }

        .coupon-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 0.04em;
          margin: 0 0 4px;
        }

        .coupon-sub {
          font-size: 11px;
          color: #6b6459;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 2rem;
        }

        .coupon-table {
          background: #111;
          border: 1px solid #2a2318;
          border-radius: 2px;
          overflow: hidden;
        }

        .coupon-header {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 0.5fr;
          padding: 15px 25px;
          background: #1a1712;
          border-bottom: 1px solid #2a2318;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #c9a84c;
          font-weight: 600;
        }

        .coupon-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 0.5fr;
          align-items: center;
          padding: 18px 25px;
          border-bottom: 1px solid #1a1712;
          transition: background 0.3s;
        }

        .coupon-row:hover {
          background: #161410;
        }

        .coupon-code-text {
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #e8e0d0;
        }

        .coupon-discount {
          font-size: 14px;
          color: #c9a84c;
        }

        .coupon-date {
          font-size: 13px;
          color: #8a7a5e;
        }

        .remove-icon {
          cursor: pointer;
          color: #6b6459;
          text-align: center;
          font-size: 12px;
          letter-spacing: 0.1em;
          transition: color 0.2s;
        }

        .remove-icon:hover {
          color: #ff4d4d;
        }

        @media (max-width: 768px) {
          .coupon-header { display: none; }
          .coupon-row {
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            padding: 20px;
          }
        }
      `}</style>

      <div className="coupon-wrap">
        <div className="coupon-accent-line" />
        <h1 className="coupon-title">COUPON LIST</h1>
        <p className="coupon-sub">รายการรหัสส่วนลดทั้งหมดที่ใช้งานได้</p>

        <div className="coupon-table">
          {/* Header */}
          <div className="coupon-header">
            <span>Code</span>
            <span>Discount</span>
            <span>Expiry Date</span>
            <span className="text-center">Action</span>
          </div>

          {/* List Items */}
          {list.map((item, index) => (
            <div className="coupon-row" key={index}>
              <div className="coupon-code-text">{item.code}</div>
              <div className="coupon-discount">฿{item.discount.toLocaleString()}</div>
              <div className="coupon-date">
                {new Date(item.expiryDate).toLocaleDateString('th-TH', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
              <div 
                onClick={() => removeCoupon(item._id)} 
                className="remove-icon"
              >
                REMOVE
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <div className="p-12 text-center text-gray-600 italic text-sm">
              No coupons available in the database.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ListCoupon