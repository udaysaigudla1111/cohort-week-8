const { Router } = require("express")
const {userModel} = require("../db.js")
const bcrypt = require("bcrypt")
const {z} = require("zod")
const jwt = require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET
const { parse } = require("dotenv")
const userRouter = Router();
 
userRouter.post("/signup",async (req,res)=>{
    const {email,password,firstName,lastName} = req.body;
 
    const requiredBody = z.object({
        email:z.string().trim().min(4).max(30).email(),
        password:z.string().min(3).max(20),
        firstName:z.string().trim().min(3).max(20),
        lastName:z.string().trim().min(3).max(20)
    })
 
    const parsedBody = requiredBody.safeParse(req.body)
 
    if(!parsedBody.success)
    {
        return res.status(400).json({
            message:"PLEASE ENTER THE DETAILS CORRECTLY",
            error:parsedBody.error
        })
    }
 
    try {
 
        const userExists = await userModel.findOne({email})
 
        if(userExists)
        {
           return res.status(400).json({
                message:"USER ALREADY EXISTS"
            })
        }
 
        const hashedPassword = bcrypt.hash(password,5)
        
        const user = await userModel.create({
            email,
            password:hashedPassword,
            firstName,
            lastName
        })
 
        return res.status(200).json({
            message:"USER SIGNUP SUCCESSFULLY",
            user
        })
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
 
})
 
userRouter.post("/signin",async (req,res)=>{
    const {email,password} = req.body
 
    const requiredBody = z.object({
        email:z.string().trim().min(4).max(30).email(),
        password:z.string().min(3).max(20)    
    })
 
    const parsedBody = requiredBody.safeParse(req.body)
 
    if(!parsedBody.success)
    {
        return res.status(400).json({
            message:"PLEASE ENTER THE DETAILS CORRECTLY"
        })
    }
 
    try {
 
        const userExists = await userModel.findOne({email})
 
        if(userExists)
        {
            const isMatchPassword = await bcrypt.compare(password,userExists.password)
            if(isMatchPassword)
            {
                const token = jwt.sign({
                    id:userExists._id
                },JWT_SECRET)

                return res.status(200).json({
                    token
                })
            }
            else{
                return res.status(400).json({
                    message:"INCORRECT CREDENTIALS"
                })
            }
        }
        else{
            return res.status(400).json({
                message:"USER NOT FOUND PLEASE SIGNUP"
            })
        }
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        })
    }
 
})
 
module.exports = { userRouter }