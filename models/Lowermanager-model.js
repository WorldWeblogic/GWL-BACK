const mongoose=require('mongoose')

const LowerManagerSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    managerid: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    phone:{
        type: Number,
        required: true,
        unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
},
{timestamps:true}
)

module.exports=mongoose.model('LowerManager',LowerManagerSchema);
