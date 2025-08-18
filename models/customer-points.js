const mongoose = require("mongoose");
const { string } = require("zod");

const formSchema = new mongoose.Schema(
  {
    id:{
        type:String,
    },
    documentation:{
        type:Number,
        default:0
    },
    handling:{
        type:Number,
        default:0
    },
    agency:{
        type:Number,
        default:0
    },
    GWLHandling:{
        type:Number,
        default:0
    },
    freight:{
        type:Number,
        default:0
    },
    loading:{
        type:Number,
        default:0
    },
    offloading:{
        type:Number,
        default:0
    },
    storage:{
        type:Number,
        default:0
    },
    transport:{
        type:Number,
        default:0
    },
    points:{
        type:Number,
        default:0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerSaleform", formSchema);
