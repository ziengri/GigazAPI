import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
    name:{
      type:String,
      required:true,
    },
    count:{
      type:Number,
      required:true,
    },
    from:{
      type:mongoose.Types.ObjectId,
      ref:"Storage",
      required:true,
    },
    to:{
      type:mongoose.Types.ObjectId,
      ref:"Storage",
      required:true,
    },
    status:{
      type:String,
      default:"Ожидает отправки"
    },
    deliveryMan:{
      type:mongoose.Types.ObjectId,
      ref:"User",
      default:undefined
    }
},{
  timestamps:true
}
);
export default mongoose.model('Delivery',DeliverySchema);
