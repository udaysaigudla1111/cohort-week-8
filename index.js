const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()
const url = process.env.url
const PORT = process.env.PORT

const app = express();
app.use(express.json())
const {adminRouter} = require("./Routes/admin")
const {courseRouter} = require("./Routes/course")
const {userRouter} = require("./Routes/user")



    app.use("/api/v1/admin",adminRouter)
    app.use("/api/v1/user",userRouter)
    app.use("/api/v1/course",courseRouter)


async function main()
{
    
    
    await mongoose.connect(url)
    console.log("Connected to the mongoose database");
    
    app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
    })
}


main();