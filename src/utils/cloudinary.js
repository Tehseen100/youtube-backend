import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Load environment variables
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload Function
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "youtube-backend",
            resource_type: "auto",
        });

        // Remove local temp file
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Remove local temp file if error occurs
        fs.unlinkSync(localFilePath);
        return null;
    }
};

// Delete Function
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);

    } catch (error) {
        console.log("Cloudinary deletion failed:", error);
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }
