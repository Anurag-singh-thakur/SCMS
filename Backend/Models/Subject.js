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
    coverImg: {
        type: String,
        default: null
    },
    desc: {
        type: String,
        default: ''
    },
    students: [{
        stuname:{
            type: String,
            default: null
        }
    }]
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
