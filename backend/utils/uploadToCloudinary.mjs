import cloudinary from "../config/cloudinary.mjs";

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "ngo-documents", resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); // ✅ full object
      }
    ).end(fileBuffer);
  });
};