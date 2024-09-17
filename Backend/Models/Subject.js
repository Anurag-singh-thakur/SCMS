import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    sname: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    notice: [{
        NoticeText: {
            type: String,
        },
        img: {
            type: String, 
        }
    }],
    assignment: [{
        AssignmentText: {
            type: String,
        },
        img: {
            type: String, 
        },
        dueDate: {
            type: Date
        }
    }],
    coverImg: {
        type: String,
        default: null
    },
    desc: {
        type: String,
        default: ''
    },
    students: [{
        stuId:{
            type: mongoose.Schema.Types.ObjectId,
            default: null
        }
    }],
    groupChat: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",   
    }],
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
