
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/customer-model');

const authenticatetoken = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Token'
            });
        }

        const userdata = await User.findOne({ email: decode.email }).select("-password");
        req.user = userdata;
        req.token = token;
        req.userId = userdata._id;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authenticatetoken;


