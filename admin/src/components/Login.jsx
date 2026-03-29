import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

                .login-bg {
                    background: #0a0a0a;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'DM Sans', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* ตกแต่งพื้นหลังเล็กน้อยให้ดูแพง */
                .login-bg::before {
                    content: '';
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(201, 168, 76, 0.05) 0%, rgba(0,0,0,0) 70%);
                    top: -100px;
                    right: -100px;
                }

                .login-card {
                    background: #111;
                    border: 1px solid #2a2318;
                    padding: 3rem 2.5rem;
                    width: 100%;
                    max-width: 400px;
                    position: relative;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }

                .login-corner {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                }
                .l-tl { top: -1px; left: -1px; border-top: 1px solid #c9a84c; border-left: 1px solid #c9a84c; }
                .l-br { bottom: -1px; right: -1px; border-bottom: 1px solid #c9a84c; border-right: 1px solid #c9a84c; }

                .login-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 32px;
                    color: #c9a84c;
                    text-align: center;
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.05em;
                }

                .login-sub {
                    font-size: 11px;
                    text-align: center;
                    color: #6b6459;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 2.5rem;
                }

                .input-label {
                    font-size: 11px;
                    color: #8a7a5e;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 8px;
                    display: block;
                }

                .luxury-input {
                    width: 100%;
                    background: #0d0d0d;
                    border: 1px solid #2a2318;
                    padding: 12px 15px;
                    color: #e8e0d0;
                    outline: none;
                    transition: all 0.3s;
                    margin-bottom: 1.5rem;
                }

                .luxury-input:focus {
                    border-color: #c9a84c;
                    background: #161410;
                }

                .login-btn {
                    width: 100%;
                    background: #c9a84c;
                    color: #0a0a0a;
                    border: none;
                    padding: 14px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 1rem;
                }

                .login-btn:hover {
                    background: #e0be6a;
                    box-shadow: 0 0 20px rgba(201, 168, 76, 0.2);
                }

                .footer-text {
                    font-size: 10px;
                    color: #333;
                    text-align: center;
                    margin-top: 2rem;
                    letter-spacing: 0.05em;
                }
            `}</style>

            <div className="login-bg">
                <div className="login-card">
                    <div className="login-corner l-tl" />
                    <div className="login-corner l-br" />

                    <h1 className="login-title">ADMIN PANEL</h1>
                    <p className="login-sub">Secure Access</p>

                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-4">
                            <label className="input-label">Email Address</label>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                className="luxury-input" 
                                type="email" 
                                placeholder="admin@example.com" 
                                required 
                            />
                        </div>

                        <div className="mb-6">
                            <label className="input-label">Password</label>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                className="luxury-input" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                            />
                        </div>

                        <button className="login-btn" type="submit"> 
                            Log In 
                        </button>
                    </form>

                    <p className="footer-text">GEM SHOP MANAGEMENT SYSTEM v1.0</p>
                </div>
            </div>
        </>
    )
}

export default Login