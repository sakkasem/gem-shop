// admin/src/pages/Add.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Keyboards")

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", "")
      formData.append("sizes", JSON.stringify([]))
      image1 && formData.append("image1", image1)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const categories = ["Keyboards", "Mice", "Monitors", "Headsets", "Speakers", "Storage", "Accessories"]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .add-wrap {
          background: #0a0a0a;
          min-height: 100vh;
          padding: 2.5rem;
          font-family: 'DM Sans', sans-serif;
          color: #e8e0d0;
        }

        .add-accent-line {
          width: 40px;
          height: 2px;
          background: #c9a84c;
          margin-bottom: 1rem;
        }

        .add-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 0.04em;
          margin: 0 0 4px;
        }

        .add-sub {
          font-size: 11px;
          color: #6b6459;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 2.5rem;
        }

        .add-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .add-grid { grid-template-columns: 1fr; }
        }

        .add-card {
          background: #111;
          border: 1px solid #2a2318;
          border-radius: 2px;
          padding: 2rem;
          position: relative;
        }

        .add-corner {
          position: absolute;
          width: 14px;
          height: 14px;
        }

        .add-corner-tl {
          top: -1px;
          left: -1px;
          border-top: 1px solid #c9a84c;
          border-left: 1px solid #c9a84c;
        }

        .add-corner-br {
          bottom: -1px;
          right: -1px;
          border-bottom: 1px solid #c9a84c;
          border-right: 1px solid #c9a84c;
        }

        .add-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a7a5e;
          margin-bottom: 8px;
        }

        .add-input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2318;
          border-radius: 1px;
          color: #e8e0d0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 14px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }

        .add-input:focus {
          border-color: #c9a84c;
        }

        .add-input::placeholder {
          color: #3a3228;
        }

        .add-textarea {
          min-height: 140px;
          resize: vertical;
        }

        .add-field {
          margin-bottom: 1.5rem;
        }

        .add-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .add-select {
          width: 100%;
          appearance: none;
          background: #0a0a0a url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5' fill='none'/%3E%3C/svg%3E") no-repeat right 14px center;
          border: 1px solid #2a2318;
          border-radius: 1px;
          color: #e8e0d0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 14px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }

        .add-select:focus {
          border-color: #c9a84c;
        }

        .add-divider {
          height: 1px;
          background: linear-gradient(90deg, #2a2318, #c9a84c44, #2a2318);
          margin: 0 0 1.5rem;
        }

        .add-right-card {
          display: flex;
          flex-direction: column;
        }

        .add-upload-label {
          cursor: pointer;
          flex: 1;
          display: block;
        }

        .add-upload-area {
          border: 1px dashed #2a2318;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #0a0a0a;
          transition: border-color 0.2s, background 0.2s;
          overflow: hidden;
        }

        .add-upload-area:hover {
          border-color: #c9a84c;
          background: #0f0e0b;
        }

        .add-upload-text {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #6b6459;
          text-align: center;
          text-transform: uppercase;
          line-height: 1.6;
        }

        .add-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .add-btn {
          width: 100%;
          padding: 15px;
          background: #c9a84c;
          border: none;
          color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1.5rem;
        }

        .add-btn:hover {
          background: #e0be6a;
        }
      `}</style>

      <div className="add-wrap">
        <div className="add-accent-line" />
        <h1 className="add-title">ADD NEW PRODUCT</h1>
        <p className="add-sub">เพิ่มสินค้าเข้าคลังสินค้า</p>

        <form onSubmit={onSubmitHandler} className="add-grid">

          {/* Left Column */}
          <div className="add-card">
            <div className="add-corner add-corner-tl" />
            <div className="add-corner add-corner-br" />

            <div className="add-field">
              <label className="add-label">ชื่อสินค้า / Product Name</label>
              <input
                className="add-input"
                type="text"
                placeholder="เช่น Mechanical Keyboard RGB Gaming"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="add-field">
              <label className="add-label">รายละเอียดสินค้า / Description</label>
              <textarea
                className="add-input add-textarea"
                placeholder="อธิบายจุดเด่น, สเปก, และรายละเอียดของสินค้า..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="add-divider" />

            <div className="add-row">
              <div>
                <label className="add-label">หมวดหมู่ / Category</label>
                <select
                  className="add-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="add-label">ราคา (บาท) / Price</label>
                <input
                  className="add-input"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="add-card add-right-card">
            <div className="add-corner add-corner-tl" />
            <div className="add-corner add-corner-br" />

            <label className="add-label">รูปภาพสินค้า / Product Image</label>

            <label htmlFor="image1" className="add-upload-label">
              <div className="add-upload-area">
                {image1 ? (
                  <img className="add-preview-img" src={URL.createObjectURL(image1)} alt="preview" />
                ) : (
                  <>
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="12" width="30" height="22" rx="1" stroke="#c9a84c" strokeWidth="1"/>
                      <path d="M14 21l6-7 6 7" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 14v14" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
                      <path d="M13 34h14" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    <div className="add-upload-text">Click to upload<br/>or drag &amp; drop</div>
                  </>
                )}
              </div>
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
                required
              />
            </label>

            <button type="submit" className="add-btn">
              + เพิ่มสินค้าเข้าคลัง
            </button>
          </div>

        </form>
      </div>
    </>
  )
}

export default Add