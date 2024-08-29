import mongoose from "mongoose";
import User from "../Models/User.js";
import generateCookie from "../util/helper/generateCookie.js";
import bcrypt from "bcrypt"


const signupController = async(req,res) =>{
    try {
        const {username,email} = req.body;
        let {password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const user = await User.findOne({ $or: [{email},{username}]}); 

        if(user){
            res.status(404).json({err:"user alreay exist"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            email,
            password:hashedPass
        })

        await newUser.save();

        if(newUser){
            generateCookie(newUser._id,res);
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username
            });
        } 
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`server error ${error}`})
    }
}

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ err: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ err: "Invalid credentials" });
        }
        generateCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            name: user.fname,
            email: user.email,
            username: user.username
        });

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            return res.status(500).json({ err: "Internal server error" });
        }
    }
};

const logoutController = async(req,res) => {
    try {
        res.cookie("jwt","",{maxAge:1});
		res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in signupUser: ", error);
        res.status(500).json({ error });

    }
}

export {signupController,loginController,logoutController};