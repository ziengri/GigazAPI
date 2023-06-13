import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    login:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    role:{
        type:[String],
        required:true
    },
    access:{
        type:[mongoose.Types.ObjectId],
        ref:"Building",
        required:true
    }
},
{
    timestamps:true,
}
);

export default mongoose.model('User',UserSchema);