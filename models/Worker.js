import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        unique:true
    },
    telephone:{
        type:Number,
        required:true,
        unique:true
    },
    specialization:{
        type:String,
        required:true
    },
    supervisor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    object_work_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Building',
        required:true
    },
},
{
    timestamps:true,
}
);

export default mongoose.model('Worker',WorkerSchema);