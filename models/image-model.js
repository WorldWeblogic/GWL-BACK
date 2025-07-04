const mongoose=require("mongoose")
const imageschema=mongoose.Schema({
    path:{
        type:String,
        required:true
    },
    filename:{
        type:String,
        required:true
    }
})
const ImageModel=mongoose.model("images",imageschema)
module.exports={ImageModel}