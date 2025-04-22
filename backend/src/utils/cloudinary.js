import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { Readable } from "stream";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Force HTTPS URLs
});

// Keep original function for backward compatibility
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            secure: true // Force HTTPS URLs
        });
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

// New function to upload directly from buffer
const uploadBufferToCloudinary = async (buffer, folder = "temp") => {
    try {
        if (!buffer) return null;

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "auto",
                    secure: true // Force HTTPS URLs
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            
            // Convert buffer to readable stream and pipe to cloudinary
            const readableStream = Readable.from(buffer);
            readableStream.pipe(uploadStream);
        });
    } catch (error) {
        console.error("Error uploading buffer to cloudinary:", error);
        return null;
    }
};

// Function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
      if (!publicId) return null;
      
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Error deleting from cloudinary:", error);
      return null;
    }
  };

export { uploadOnCloudinary, uploadBufferToCloudinary, deleteFromCloudinary};