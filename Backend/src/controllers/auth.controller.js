import User from '../models/user.model.js';
import { generateToken } from '../utils/jwtTokenGenerator.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const {email, fullName, password} = req.body;
    try {
        // check if all fields are filled
        if(!email || !fullName || !password) {
            return res.status(400).json({message: 'Please fill all the fields'});
        }
        // check if password is valid 
        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }
        // check if user already exists
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({message: 'User already exists'});
        }
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        // JWT token generation
        if (newUser) {
            //generate JWT token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            });
        }
        else {
            return res.status(400).json({message: 'Invalid user data'});
        }
    }
    // catch errors
    catch(error) {
        console.log("Error in signup controller", error.message);
        return res.status(500).json({message: 'Internal Server error'});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // JWT token generation
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

export const logout = (req, res) => {
    // clear the cookie
    try {
        res.cookie("jwt", " ", { maxAge: 0 });
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

export const updateProfile = async (req, res) => { 
    try {
        const { profilePicture } = req.body;
        const userId = req.user._id;
        // check if profile picture is provided
        if (!profilePicture) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }
        const uploadResponses = await cloudinary.uploader.upload(profilePicture)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: uploadResponses.secure_url },
            { new: true }
        );
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("Error in updateProfile controller", error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

export const checkAuth = (req, res) => { 
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth controller", error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};
