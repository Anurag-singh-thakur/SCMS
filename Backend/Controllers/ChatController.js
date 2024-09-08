import Stream from 'getstream';  // Correct SDK for server-side
import mongoose from "mongoose";
import Chat from "../Models/chat.js";
import Subject from "../Models/Subject.js";
import { io } from "../socket/socket.js";  


const getGroupMessages = async (req, res) => {
    const { subjectId } = req.params;
    
    try {
        const subject = await Subject.findById(subjectId).populate({
            path: 'groupChat',
            populate: {
                path: 'sender participants',
                select: 'username email',
            }
        });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        const subjname = subject.sname;
        
        return res.status(200).json({ messages: subject.groupChat, subjectName: subjname });
    } catch (error) {
        console.error('Error fetching group messages:', error);
        return res.status(500).json({ message: "Server error" });
    }
};

const postGroupMessage = async (req, res) => {
    const { subjectId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    try {
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        const newMessage = new Chat({
            sender: userId,
            subject: subjectId,
            message,
            participants: subject.students.map(student => student.stuId),
        });

        const savedMessage = await newMessage.save();

        const populatedMessage = await Chat.findById(savedMessage._id)
            .populate('sender', 'username imageUrl')  
            .populate('participants', 'username email');

        subject.groupChat.push(savedMessage._id);
        await subject.save();

        io.to(subjectId).emit("newMessage", populatedMessage);
        console.log('Message posted successfully', populatedMessage);
        return res.status(201).json({ message: "Message posted successfully", chat: populatedMessage });
    } catch (error) {
        console.error('Error posting group message:', error);
        return res.status(500).json({ message: "Server error" });
    }
};

const apiKey = 'j7gdbzr5dj23';
const api_secret = 'qnunk49ah2uatesrugy56vbygbtg4h8mnvjk68n5xg2z32ypqepm98mdfgvxgt7s';
const appId = '1335756'; 
const createToken = async (req, res) => {
    try {
        console.log(req.user._id);

        // Connect to the Stream API using the correct API keys
        const client = Stream.connect(apiKey, api_secret, appId);

        // Generate a user token for the current user
        const userId = req.user._id;
        
        console.log(userId.toString(), "req.user._id");
        const token = client.createUserToken(userId.toString());   

        console.log(token);
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export { postGroupMessage, getGroupMessages,createToken };
