import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddCoupon = ({ backendUrl, token }) => {

    const [code, setCode] = useState("")
    const [discount, setDiscount] = useState("")
    const [expiryDate, setExpiryDate] = useState("")

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(backendUrl + '/api/coupon/add', 
                { code: code.toUpperCase(), discount: Number(discount), expiryDate }, 
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setCode("");
                setDiscount("");
                setExpiryDate("");
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error("เกิดข้อผิดพลาดในการเพิ่มคูปอง");
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

                .luxury-wrap {
                    background: #0a0a0a;
                    min-height: 100vh;
                    padding: 2.5rem;
                    font-family: 'DM Sans', sans-serif;
                    color: #e8e0d0;
                }

                .luxury-accent-line {
                    width: 40px;
                    height: 2px;
                    background: #c9a84c;
                    margin-bottom: 1rem;
                }

                .luxury-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 30px;
                    font-weight: 600;
                    color: #c9a84c;
                    letter-spacing: 0.04em;
                    margin: 0 0 4px;
                }

                .luxury-sub {
                    font-size: 11px;
                    color: #6b6459;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin: 0 0 2.5rem;
                }

                .luxury-card {
                    background: #111;
                    border: 1px solid #2a2318;
                    border-radius: 2px;
                    padding: 2.5rem;
                    position: relative;
                    max-width: 600px;
                }

                .luxury-corner {
                    position: absolute;
                    width: 14px;
                    height: 14px;
                }

                .luxury-corner-tl { top: -1px; left: -1px; border-top: 1px solid #c9a84c; border-left: 1px solid #c9a84c; }
                .luxury-corner-br { bottom: -1px; right: -1px; border-bottom: 1px solid #c9a84c; border-right: 1px solid #c9a84c; }

                .luxury-label {
                    display: block;
                    font-size: 11px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #8a7a5e;
                    margin-bottom: 8px;
                }

                .luxury-input {
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
                    margin-bottom: 1.5rem;
                }

                .luxury-input:focus { border-color: #c9a84c; }

                .luxury-btn {
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
                    margin-top: 1rem;
                }

                .luxury-btn:hover { background: #e0be6a; }
            `}</style>

            <div className="luxury-wrap">
                <div className="luxury-accent-line" />
                <h1 className="luxury-title">ADD NEW COUPON</h1>
                <p className="luxury-sub">สร้างรหัสส่วนลดใหม่สำหรับลูกค้า</p>

                <form onSubmit={onSubmitHandler} className="luxury-card">
                    <div className="luxury-corner luxury-corner-tl" />
                    <div className="luxury-corner luxury-corner-br" />

                    <div>
                        <label className="luxury-label">รหัสคูปอง / Coupon Code</label>
                        <input
                            className="luxury-input"
                            type="text"
                            placeholder="เช่น PROMO100"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="luxury-label">จำนวนส่วนลด (บาท) / Discount Amount</label>
                        <input
                            className="luxury-input"
                            type="number"
                            placeholder="100"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="luxury-label">วันหมดอายุ / Expiry Date</label>
                        <input
                            className="luxury-input"
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="luxury-btn">
                        + Create Coupon
                    </button>
                </form>
            </div>
        </>
    )
}

export default AddCoupon