import mongoose from "mongoose";

const verificationSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    token:{
        type:String,
        required:true
    },
    expiredAt:{
        type:Date,
        required:true
    }
},{timestamps:true});

const Verfication=mongoose.model("Verification",verificationSchema);
export default Verfication;