import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("อัปเดตสถานะสำเร็จ")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .order-wrap {
          background: #0a0a0a;
          min-height: 100vh;
          padding: 2.5rem;
          font-family: 'DM Sans', sans-serif;
          color: #e8e0d0;
        }

        .order-accent-line {
          width: 40px;
          height: 2px;
          background: #c9a84c;
          margin-bottom: 1rem;
        }

        .order-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 0.04em;
          margin: 0 0 4px;
        }

        .order-sub {
          font-size: 11px;
          color: #6b6459;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 2rem;
        }

        .order-card {
          background: #111;
          border: 1px solid #2a2318;
          border-radius: 2px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          display: grid;
          grid-template-columns: 0.5fr 2fr 1.5fr 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
          transition: border-color 0.3s;
        }

        .order-card:hover {
          border-color: #c9a84c;
        }

        .order-icon {
          width: 50px;
          height: 50px;
          border: 1px solid #2a2318;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #161410;
        }

        .item-name {
          font-size: 14px;
          color: #e8e0d0;
          margin-bottom: 4px;
        }

        .customer-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: #c9a84c;
          margin-bottom: 8px;
        }

        .text-small {
          font-size: 12px;
          color: #8a7a5e;
          line-height: 1.6;
        }

        .price-tag {
          font-size: 18px;
          color: #c9a84c;
          font-weight: 500;
        }

        .status-select {
          background: #0a0a0a;
          border: 1px solid #2a2318;
          color: #e8e0d0;
          padding: 8px;
          font-size: 12px;
          outline: none;
          cursor: pointer;
          width: 100%;
        }

        .status-select:focus {
          border-color: #c9a84c;
        }

        .receipt-btn {
          padding: 8px 12px;
          border: 1px solid #c9a84c;
          color: #c9a84c;
          background: transparent;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.3s;
          width: 100%;
        }

        .receipt-btn:hover {
          background: #c9a84c;
          color: #0a0a0a;
        }

        .payment-status {
          display: inline-block;
          padding: 2px 8px;
          font-size: 10px;
          text-transform: uppercase;
          margin-top: 8px;
        }

        .paid { background: #1b2e1b; color: #4ade80; border: 1px solid #4ade8044; }
        .unpaid { background: #2e1b1b; color: #f87171; border: 1px solid #f8717144; }

        @media (max-width: 1024px) {
          .order-card { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .order-card { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="order-wrap">
        <div className="order-accent-line" />
        <h1 className="order-title">ORDER MANAGEMENT</h1>
        <p className="order-sub">ตรวจสอบและจัดการคำสั่งซื้อของลูกค้า</p>

        <div className="order-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              {/* 1. Icon */}
              <div className="order-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                  <path d="M21 8V21H3V8M21 8L12 3L3 8M21 8L12 13L3 8" />
                </svg>
              </div>

              {/* 2. Items & Date */}
              <div>
                {order.items.map((item, idx) => (
                  <p key={idx} className="item-name">
                    {item.name} <span style={{color: '#c9a84c'}}>x {item.quantity}</span>
                  </p>
                ))}
                <p className="text-small" style={{marginTop: '10px'}}>
                  {new Date(order.date).toLocaleDateString('th-TH')}
                </p>
              </div>

              {/* 3. Customer Info */}
              <div>
                <p className="customer-name">{order.address.firstName} {order.address.lastName}</p>
                <p className="text-small">{order.address.street}, {order.address.city}</p>
                <p className="text-small" style={{color: '#c9a84c'}}>{order.address.phone}</p>
              </div>

              {/* 4. Payment Info */}
              <div>
                <p className="price-tag">฿{order.amount.toLocaleString()}</p>
                <p className="text-small">{order.paymentMethod}</p>
                <span className={`payment-status ${order.payment ? 'paid' : 'unpaid'}`}>
                  {order.payment ? 'ชำระแล้ว' : 'ค้างชำระ'}
                </span>
              </div>

              {/* 5. Actions */}
              <div className="flex flex-col gap-2">
                <select 
                  onChange={(event) => statusHandler(event, order._id)} 
                  value={order.status} 
                  className="status-select"
                >
                  <option value="Order Placed">ออเดอร์ใหม่</option>
                  <option value="Packing">กำลังแพ็ค</option>
                  <option value="Shipped">ส่งแล้ว</option>
                  <option value="Out for delivery">กำลังนำส่ง</option>
                  <option value="Delivered">สำเร็จแล้ว</option>
                </select>

                {(order.paymentMethod !== 'Stripe' && order.paymentMethod !== 'COD') ? (
                  <button 
                    onClick={() => window.open(`${backendUrl}/uploads/${order.paymentReceipt}`, '_blank')}
                    className="receipt-btn"
                  >
                    View Receipt
                  </button>
                ) : (
                  <p className="text-small" style={{textAlign: 'center', fontStyle: 'italic', fontSize: '10px'}}>No receipt required</p>
                )}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="p-20 text-center text-gray-600">
              No orders found in the system.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Orders