import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
      try {
        const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
        
        if (response.data.success) {
          toast.success(response.data.message)
          await fetchList();
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .list-wrap {
          background: #0a0a0a;
          min-height: 100vh;
          padding: 2.5rem;
          font-family: 'DM Sans', sans-serif;
          color: #e8e0d0;
        }

        .list-accent-line {
          width: 40px;
          height: 2px;
          background: #c9a84c;
          margin-bottom: 1rem;
        }

        .list-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 0.04em;
          margin: 0 0 4px;
        }

        .list-sub {
          font-size: 11px;
          color: #6b6459;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 2rem;
        }

        .list-container {
          background: #111;
          border: 1px solid #2a2318;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .list-header {
          display: grid;
          grid-template-columns: 0.7fr 2fr 1fr 1fr 0.5fr;
          align-items: center;
          padding: 15px 20px;
          background: #1a1712;
          border-bottom: 1px solid #2a2318;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #c9a84c;
          font-weight: 600;
        }

        .list-item {
          display: grid;
          grid-template-columns: 0.7fr 2fr 1fr 1fr 0.5fr;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #1a1712;
          transition: background 0.2s;
        }

        .list-item:hover {
          background: #161410;
        }

        .list-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border: 1px solid #2a2318;
          border-radius: 1px;
        }

        .product-name {
          font-size: 14px;
          font-weight: 400;
          color: #e8e0d0;
        }

        .product-cat {
          font-size: 12px;
          color: #8a7a5e;
        }

        .product-price {
          font-size: 14px;
          color: #c9a84c;
          font-weight: 500;
        }

        .delete-btn {
          cursor: pointer;
          color: #6b6459;
          text-align: center;
          font-size: 14px;
          transition: color 0.2s;
        }

        .delete-btn:hover {
          color: #ff4d4d;
        }

        @media (max-width: 768px) {
          .list-header { display: none; }
          .list-item {
            grid-template-columns: 1fr 2fr 1fr;
            gap: 10px;
          }
          .product-cat { display: none; }
        }
      `}</style>

      <div className="list-wrap">
        <div className="list-accent-line" />
        <h1 className="list-title">INVENTORY LIST</h1>
        <p className="list-sub">จัดการรายการสินค้าทั้งหมดในระบบ</p>

        <div className="list-container">
          {/* Header */}
          <div className="list-header">
            <span>Image</span>
            <span>Product Name</span>
            <span>Category</span>
            <span>Price</span>
            <span className="text-center">Action</span>
          </div>

          {/* Product Items */}
          {list.map((item, index) => (
            <div className="list-item" key={index}>
              <img className="list-img" src={item.image[0]} alt={item.name} />
              <p className="product-name">{item.name}</p>
              <p className="product-cat">{item.category}</p>
              <p className="product-price">฿{item.price.toLocaleString()}</p>
              <p 
                onClick={() => removeProduct(item._id)} 
                className="delete-icon delete-btn"
              >
                REMOVE
              </p>
            </div>
          ))}

          {list.length === 0 && (
            <div className="p-10 text-center text-gray-600">
              No products found in inventory.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default List