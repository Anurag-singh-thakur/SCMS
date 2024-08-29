import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    image:String,
    member:String,
    class:[{
        subject:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        }
    }]
},{timestamps:true});

export default mongoose.model('User', userSchema)