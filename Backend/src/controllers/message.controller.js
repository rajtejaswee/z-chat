import User from "../models/user.model.js";

export const getUsersForSiderbar = async (req, res) => {
    try { 
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUser);
    }
    catch (error) {
        console.log("Error in getUsersForSiderbar controller", error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};
 
export const getMessages = async (req, res) => {
    try {
        const { id: userChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userChatId },
                { senderId: userChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages);
    }
    catch (error) {
        console.log("Error in getMessages controller", error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

export const sendMessage = async (req, res) => { 
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            // upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        // todo : realtime functionality

        res.status(200).json(newMessage);
    }
    catch (error) {
        console.log("Error in sendMessage controller", error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};