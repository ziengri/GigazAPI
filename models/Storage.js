import mongoose, { trusted } from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    count:{
      type:Number,
      default:1
    }
});
// );
// type:mongoose.SchemaTypes.ObjectId,
// required:true,
// ref:"Building"
const StorageSchema = new mongoose.Schema({
    products:{
      type:[ProductSchema]}
},{
  timestamps:true
}
);
export default mongoose.model('Storage',StorageSchema);
// default:undefined
// [{
//   name:{
//       type:String,
//       unique: true,
//     },
//     count:{
//       type:Number,
//       default:1
//     }
// }]