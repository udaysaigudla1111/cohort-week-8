const {Router, application} = require("express");
const adminRouter = Router();
const {z} = require("zod")
const jwt = require("jsonwebtoken")
const JWT_ADMIN_SECRET=process.env.JWT_ADMIN_SECRET
const bcrypt = require("bcrypt")
const {adminMiddleware} = require("../middleware/admin")
const {adminModel,courseModel} = require("../db.js");




adminRouter.post("/signup",async (req,res)=>{

    const {email,password,firstName,lastName} = req.body;

    const requiredbody = z.object({                                 // 2
        email:z.string().trim().min(3).max(30).email(),
        password:z.string().min(4).max(20),
        firstName:z.string().trim().min(4).max(9),
        lastName:z.string().trim().min(4).max(9)
    })

    const parsedData = requiredbody.safeParse(req.body)

    if(!parsedData.success)
    {
        return res.status(400).json({
            message:"PLEASE ENTER THE DETAILS CORRECTLY",
            error:parsedData.error
        })
    }

    try {

          const adminExists = await adminModel.findOne({email})
        if(adminExists)
        {
            return res.status(400).json({
                message:"ADMIN ALREADY EXISTS"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password,5)  // 1

        const admin = await adminModel.create({
            email,
            password:hashedPassword,
            firstName,
            lastName
        })

        return res.status(200).json({
            message:"ADMIN SIGNUP SUCCESSFULLY",
            admin
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        })
    }
   
})


adminRouter.post("/signin",async (req,res)=>{
    const {email,password} = req.body;

    const requiredbody = z.object({
        email:z.string().trim().min(4).max(30).email(),
        password:z.string().min(3).max(20)
    })

    const parsedBody = requiredbody.safeParse(req.body)

    if(!parsedBody.success)
    {
        return res.json({
            message:"PLEASE ENTER THE CORRECT DETAILS",
            error:parsedBody.error
        })
    }

    try {

             const adminExists = await adminModel.findOne({email})

            if(adminExists)
            {   

                const isMatchPassword = await bcrypt.compare(password,adminExists.password)

                if(isMatchPassword)
                {
                    const token = jwt.sign({
                        id:adminExists._id
                    },JWT_ADMIN_SECRET)

                    return res.status(200).json({
                        token
                    })
                }
                else{
                    return res.status(400).json({
                        message:"INVALID CREDENTIALS"
                    })
                }

            }else{
                return res.status(400).json({
                    message:"ADMIN NOT FOUND PLEASE SIGNUP"
                })
            }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        })
    }
  
})

adminRouter.post("/course",adminMiddleware,async (req,res)=>{

    const adminId = req.adminId
    const {title,description,price,imageUrl} = req.body

    try {
        
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            createrId:adminId
        })

        return res.status(200).json({
            message:"COURSE CREATED SUCCESSFULLY",
            courseId:course._id
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        })
    }

})

adminRouter.put("/course",adminMiddleware,async (req,res)=>{
    const adminId = req.adminId;

    const {title,description,price,imageUrl,courseId} = req.body;

    try {
         
    const course = await courseModel.findOne({_id:courseId});

    if(course.createrId.toString()!==adminId)
    {   
        console.log(`${course.createrId} type is ${typeof course.createrId}`);
        console.log(`The token adminId is ${adminId} and type is ${typeof adminId}`);
        
        return res.status(400).json({
            message:"The CourseId does not belongs to ADMIN"
        })
    }

    const updatedCourse = await courseModel.findOneAndUpdate({
        _id:courseId
    },
    {
        title,
        price,
        description,
        imageUrl
    },{
        new:true,
        runValidators:true
    }
    )

    return res.status(200).json({
        message:"COURSE UPDATED SUCCESSFULLY",
        updatedCourse
    })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR"
        })
    }


})

adminRouter.get("/course/bulk",adminMiddleware,async (req,res)=>{
    const adminId = req.adminId;

    try {
        const coursesArray = await courseModel.find({createrId:adminId}).populate({path:'createrId',select:'email -_id'}) 

        return res.status(200).json({
            message:"GOT ALL THE COURSES THAT WERE CREATED BY ADMIN ",
            coursesArray
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        })
    }

})

module.exports = { adminRouter }