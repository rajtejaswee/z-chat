import { v2 as cloudinary } from 'cloudinary';

import { config } from 'dotenv';
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'images',
            resource_type: 'image',
        });
        return result;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};
export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};
