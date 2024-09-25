const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET

const jwt = require("jsonwebtoken")

const adminMiddleware = (req,res,next)=>{

    const token = req.headers.token

    const decodedInfo = jwt.verify(token,JWT_ADMIN_SECRET);

    if(decodedInfo)
    {
        req.adminId=decodedInfo.id
        next();
    }
    else{
        return res.status(400).json({
            message:"Invalid token"
        })
    }

}


module.exports={adminMiddleware}