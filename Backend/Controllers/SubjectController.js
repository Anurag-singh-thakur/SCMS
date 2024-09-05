import mongoose from "mongoose";
import User from "../Models/User.js";
import Subject from "../Models/Subject.js";
import {v2 as cloudinary} from "cloudinary";

const Addsubject = async (req, res) => {
    try {
        console.log(req.user._id, "req.user._id",req.body);
        const { subjectname, coverImg, description } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!subjectname) {
            return res.status(400).json({ error: "Subject name is required" });
        }

        if (!coverImg) {
            return res.status(400).json({ error: "Cover image is required" });
        }

        const newSubject = new Subject({
            sname: subjectname,
            teacher: user.username, 
            coverImg,
            desc: description
        });

        const savedSubject = await newSubject.save();

        user.class.push({ subject: savedSubject._id });
        await user.save();

        return res.status(201).json({ message: "Subject added successfully", subject: savedSubject });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const GetSubject = async (req, res) => {
    try {
        const userId = req.params.Uid;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const username = user.username;
        const subjects = await Subject.find({
            $or: [
                { teacher: username }, 
                { 'students.stuId': userId }   
            ]
        });

        if (subjects.length === 0) {
            return res.status(404).json({ error: "No subjects found" });
        }
        return res.status(200).json(subjects);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const AddNotice = async (req, res) => {
    try {
        const { textContent } = req.body;
        let { imgUrl } = req.body;
        const userId = req.user._id;
        const { Sid } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const subject = await Subject.findById(Sid);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }

        if (!textContent) {
            return res.status(400).json({ error: "Notice text content is required" });
        }

        if (imgUrl) {
            const uploadResponse = await cloudinary.uploader.upload(imgUrl);
            imgUrl = uploadResponse.url;
        }
        
        const newNotice = {
            _id: new mongoose.Types.ObjectId(), 
            NoticeText: textContent,
            img: imgUrl || null
        };

        subject.notice.push(newNotice);
        await subject.save();

        return res.status(201).json({ 
            _id: newNotice._id,
            NoticeText: newNotice.NoticeText,
            img: newNotice.img
        });
    } catch (error) {
        console.error('Error adding notice:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const GetNotice = async (req, res) => {
    try {
        const { Sid } = req.params;
        const subject = await Subject.findById(Sid);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        return res.status(200).json(subject.notice);
    } catch (error) {
        console.error('Error getting notices:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteNotice = async(req,res) => {
    try {
        const nId = req.params.noticeId;
        const SId = req.params.subjectId;
        const subject = await Subject.findById(SId);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        //check ig=f the user is the teacher
        const user = await User.findById(req.user._id);
        const teacher = user.username;
        if (subject.teacher !== teacher) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const noticecheck = subject.notice.id(nId);
        if (!noticecheck) {
            return res.status(404).json({ error: "Notice not found" });
        }
        subject.notice.pull(nId);
        await subject.save();
        return res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
        console.log(error);
    }
}

const deleteSubject = async(req,res) => {
    try {
        const subjectId = req.params.subjectId;

        const user = await User.findById(req.user._id);
        const teacher = user.username;
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        if (subject.teacher === teacher) {
            await Subject.findByIdAndDelete(subjectId);
        }
        else{
            //remove the userId from student
            await subject.students.pull(user._id);
        }
        if(subject.teacher === teacher){}
        return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.log(error)
    }
}

const addstudent = async (req, res) => {
    try {
        const userId = req.user._id;  
        const { subjectId } = req.params;

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        const userExists = subject.students.some(student => student.stuId.toString() === userId.toString());
        if (userExists) {
            return res.status(400).json({ error: 'User already joined this subject' });
        }

        subject.students.push({ stuId: userId });
        await subject.save();

        return res.status(200).json({ message: 'User joined the subject successfully' });
    } catch (error) {
        console.error('Error joining subject:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export {Addsubject,GetSubject,AddNotice,GetNotice,deleteSubject,deleteNotice,addstudent};