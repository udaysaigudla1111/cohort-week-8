
const JWT_USER_SECRET=process.env.JWT_USER_SECRET
const jwt = require("jsonwebtoken")

const userMiddleware = (req,res,next)=>{

    const token = req.headers.token

    const decodedInfo = jwt.verify(token,JWT_USER_SECRET)

    if(decodedInfo)
    {
        req.userId = decodedInfo.id
        next();
    }
    else{
        return res.status(400).json({
            message:"INVALID TOKEN"
        })
    }


}

module.exports = {userMiddleware}