import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Login First" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.userId = token_decode.id; // ยัดใส่ body ไปเลย Controller จะได้หาเจอ
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;