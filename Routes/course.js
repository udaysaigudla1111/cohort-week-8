const {Router} = require("express")
const {courseModel,purchaseModel} = require("../db.js")
const {userMiddleware} = require("../middleware/user.js")
const courseRouter = Router();

courseRouter.post("/purchase",userMiddleware,async (req,res)=>{
    const userId = req.userId;
    const {courseId} = req.body
    try {
        const isAlreadyBought = await purchaseModel.findOne({
            userId,
            courseId
        })

        if(isAlreadyBought)
        {
            return res.status(400).json({
                message:"USER ALREADY PURCHASED THE COURSE",
                purchasedId:isAlreadyBought._id
            })
        }

        const purchased = await purchaseModel.create({
            courseId,
            userId
        })

        return res.status(200).json({
            message:"USER PURCHASED THE COURSE SUCCESSFULLY",
            purchasedId:purchased._id
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        })
    }
})
    
courseRouter.get("/preview",async (req,res)=>{

    try{
        const courses = await courseModel.find({}).populate({path:'createrId',select: 'email -_id'}).exec()

        return res.status(200).json({
            courses
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        })
        
    }
})

module.exports = {courseRouter}