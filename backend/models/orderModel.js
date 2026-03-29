import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true, default: 'COD' }, // เก็บเงินปลายทาง
    payment: { type: Boolean, required: true, default: false },// true คือจ่ายแล้ว
    paymentReceipt: { type: String, default: "" },// เก็บ URL รูปสลิป
    date: { type: Number, required: true }
    
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;