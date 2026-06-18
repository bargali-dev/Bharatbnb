import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      folder: "airbnb",
    });
    console.log(uploadResult)
    fs.unlinkSync(filepath); // delete local file
    return uploadResult.secure_url;
  } catch (error) {
    if (filepath) fs.unlinkSync(filepath);
    console.log("Cloudinary error:", error.
      message);
    throw error;
  }
};

export default uploadOnCloudinary;
