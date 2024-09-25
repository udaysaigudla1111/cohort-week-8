const mongoose = require("mongoose")





const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

////////////////////////////////////////////////////////////
const usersSchema = new Schema({
    email:
    {
        type:String,
        unique:true
    },
    password:
    {
         type:String
    },
    firstName:
    {
         type:String
    },
    lastName:
    {
         type:String
    }
},{
    timestamps:true
})


////////////////////////////////////////////////////////////
const courseSchema = new Schema({

    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    createrId:{
        type:ObjectId,
        ref:'admin'
    }

},{
    timestamps:true
})

////////////////////////////////////////////////////////////
const adminSchema = new Schema({

    email:
    {
        type:String,
        unique:true,
        required:true
    },
    password:
    {
         type:String
    },
       firstName:
    {
         type:String
    },
    lastName:
    {
         type:String
    }
},{
    timestamps:true
})

////////////////////////////////////////////////////////////
const purchaseSchema = new Schema({

    courseId:{
        type:ObjectId,
        ref:'course',
        required:true
    },
    userId:{
        type:ObjectId,
        ref:'user'                      // 4
    }

},{
    timestamps:true                     // 3
}) 
////////////////////////////////////////////////////////////

const userModel = mongoose.model("user",usersSchema);
const courseModel = mongoose.model("course",courseSchema);
const adminModel = mongoose.model("admin",adminSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema)


module.exports = {
    userModel,
    courseModel,
    adminModel,
    purchaseModel
}