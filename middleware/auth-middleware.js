const jwt=require('jsonwebtoken')
require('dotenv').config();

const authenticatetoken=(req,res,next)=>{
    
    // const token = req.cookies?.token;
    const token =req.headers['authorization'].split(' ')[1];
    if(!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        if(!decode){
            return res.status(401).json({
                success:false,
                message:'Invalid Token'
            })
        }
        req.user = decode; // Attach the verified user object to the request
        next(); // Proceed to the next middleware
        
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" }); // Proper error handling
    }
}

module.exports= authenticatetoken;
