// backend/controllers/productController.js
import productModel from "../models/Product.js"

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes } = req.body
        const imageFile = req.file; // ไฟล์รูปจาก multer

        if (!imageFile) {
            return res.json({ success: false, message: "กรุณาอัปโหลดรูปภาพสินค้า" })
        }

        // เตรียมข้อมูลสินค้า
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory: subCategory || "",
            sizes: JSON.parse(sizes) || [], // คาดหวัง sizes เป็น array string
            image: imageFile.filename, // เก็บเฉพาะชื่อไฟล์ (เช่น "1678888-shirt.jpg")
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "เพิ่มสินค้าสำเร็จ!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// 2. ฟังก์ชันดึงรายการสินค้าทั้งหมด (อันนี้ที่ขาดไปจนทำให้ Error)
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// 3. ฟังก์ชันลบสินค้า
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "ลบสินค้าเรียบร้อยแล้ว" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Export ออกไปให้ครบทั้ง 3 ฟังก์ชัน
export { addProduct, listProducts, removeProduct }