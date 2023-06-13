import mongoose from "mongoose";

const WorkersAccountSchema = new mongoose.Schema({
  workerId:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:"Worker"
  },
  was:{
    type:Boolean,
    default:false
  }
},{_id:false});

const AccountingSchema = new mongoose.Schema({
  date:{
    type:Date,
    required:true,
  },
  workers:[WorkersAccountSchema]
},{_id:false}
);

const BuildingSchema = new mongoose.Schema({
    name:{
      type:String,
      required:true,
    },
    address:{
      type:String,
      required:true,
    },
    accounting:{
      type:[AccountingSchema],
    },
    storageId:{
      type:mongoose.Types.ObjectId,
      ref:"Storage",
      required:true,
      unique:true
    }
},
);
export default mongoose.model('Building',BuildingSchema);
