import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subject: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
