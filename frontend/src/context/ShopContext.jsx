import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '฿'; // สกุลเงิน
    const delivery_fee = 50; // ค่าจัดส่ง
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // URL หลังบ้านของคุณ
    
    
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(''); // เก็บ Token สำหรับตรวจสอบการ Login

    // ดึงข้อมูลสินค้าจาก Backend จริงๆ
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product`);
            if (response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 2. ฟังก์ชันดึงข้อมูลตะกร้าจาก MongoDB (เฉพาะตอน Login แล้ว)
    const getUserCart = async ( token ) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 3. ฟังก์ชันเพิ่มสินค้า (อัปเดตให้ส่งไป DB ด้วย)
    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

        // ถ้าล็อกอินอยู่ ให้ส่งไปเก็บใน Database
        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { cartData }, { headers: { token } });
            } catch (error) {
                console.log(error);
            }
        }
    };

    // 4. ฟังก์ชันอัปเดตจำนวน (อัปเดตให้ส่งไป DB ด้วย)
    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        
        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { cartData }, { headers: { token } });
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);
    useEffect(() => {
        getProductsData();
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            getUserCart(savedToken); // ดึงตะกร้าจาก DB มาโชว์ทันที
        }
    }, []);

    // ฟังก์ชันนับจำนวนสินค้าทั้งหมดในตะกร้า (เอาไปโชว์ที่เลขบน Icon ตะกร้า)
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    };

    // ฟังก์ชันคำนวณราคารวม
    const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
        // สำคัญมาก: ต้องแปลง ID ให้เป็น String ทั้งคู่เพื่อใช้เปรียบเทียบ
        let itemInfo = products.find((product) => String(product.id || product._id) === String(items));
        
        if (itemInfo && cartItems[items] > 0) {
            // มั่นใจว่าราคาเป็นตัวเลข (Number)
            totalAmount += Number(itemInfo.price) * cartItems[items];
        }
    }
    return totalAmount;
    };

    const value = {
        products, currency, delivery_fee,
        cartItems, setCartItems, addToCart, getCartCount, getCartAmount,
        updateQuantity, backendUrl, token, setToken // เพิ่ม token และ setToken เข้าไปใน value
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};


export default ShopContextProvider;