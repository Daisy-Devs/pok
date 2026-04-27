import cloudinary from "../config/cloudinary.mjs";
import { Organization } from "../models/organization.mjs";
import { User } from "../models/user.mjs";
import { sendResponse } from "../utils/response.mjs";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.mjs";

export const uploadDocuments = async (req, res) => {
  try {
    const files = req.files;

    // ✅ 1. Validate count
    if (!files || files.length < 1 || files.length > 5) {
      return sendResponse(res, 400, "Upload between 1 and 5 files");
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    const uploadedFiles = [];

    // ✅ 2. Loop through ALL files
    for (const file of files) {
      // Type check
      if (!allowedTypes.includes(file.mimetype)) {
        return sendResponse(res, 400, "Only PDF and image files are allowed");
      }

      // PDF size limit
      if (file.mimetype === "application/pdf" && file.size > 10 * 1024 * 1024) {
        return sendResponse(res, 400, "Each PDF must be <= 10MB");
      }

      // Image size limit
      if (file.mimetype.startsWith("image/") && file.size > 2 * 1024 * 1024) {
        return sendResponse(res, 400, "Each image must be <= 2MB");
      }

      // ✅ Upload
      const result = await uploadToCloudinary(file.buffer);

      uploadedFiles.push({
        name: file.originalname,
        url: result.secure_url,
        public_id: result.public_id,
        type: file.mimetype.startsWith("image/") ? "image" : "pdf",
      });
    }

    // ✅ 3. Final response AFTER loop
    return sendResponse(res, 200, "Documents uploaded successfully", {
      documents: uploadedFiles,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, err.message);
  }
};

export const uploadCauseImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return sendResponse(res, 400, "At least 1 image required");
    }

    if (files.length > 5) {
      return sendResponse(res, 400, "Max 5 images allowed");
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!file.mimetype.startsWith("image/")) {
        return sendResponse(
          res,
          400,
          `Invalid file: ${file.originalname}. Only images allowed`,
        );
      }

      if (file.size > 2 * 1024 * 1024) {
        return sendResponse(res, 400, `${file.originalname} must be <= 2MB`);
      }

      const result = await uploadToCloudinary(file.buffer);

      if (!result?.secure_url || !result?.public_id) {
        throw new Error("Upload failed");
      }

      uploadedImages.push({
        name: file.originalname,
        url: result.secure_url,
        public_id: result.public_id,
        type: "image",
      });
    }

    return sendResponse(res, 200, "Images uploaded successfully", {
      images: uploadedImages,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, err.message);
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;

    // ✅ Required
    if (!file) {
      return sendResponse(res, 400, "Profile image is required");
    }

    // ✅ Type check
    if (!file.mimetype.startsWith("image/")) {
      return sendResponse(res, 400, "Only image files allowed");
    }

    // ✅ Size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return sendResponse(res, 400, "Max size is 2MB");
    }

    // ✅ Upload to Cloudinary
    const result = await uploadToCloudinary(file.buffer);

    // ✅ Response (IMPORTANT)
    return sendResponse(res, 200, "Profile Image uploaded successfully", {
      profileImage: {
        name: file.originalname,
        url: result.secure_url,
        public_id: result.public_id, // 🔥 IMPORTANT
        type: "image",
      },
    });
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const ngoId = req.ngoId;
    const file = req.file;

    if (!file) {
      return sendResponse(res, 400, "Image is required");
    }

    if (!file.mimetype.startsWith("image/")) {
      return sendResponse(res, 400, "Only image is allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
      return sendResponse(res, 400, "Max size is 2MB");
    }

    const org = await Organization.findById(ngoId);

    if (!org) {
      return sendResponse(res, 404, "Organization not found");
    }

    // ✅ Delete old image (if exists)
    if (org.profileImage?.public_id) {
      await cloudinary.uploader.destroy(org.profileImage.public_id);
    }

    // ✅ Upload new image
    const result = await uploadToCloudinary(file.buffer);

    org.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await org.save();

    return sendResponse(res, 200, "Profile Image updated successfully", {
      profileImage: {
        name: file.originalname,
        url: result.secure_url,
        type: "image",
      },
    });
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const ngoId = req.ngoId;
    const org = await Organization.findById(ngoId);

    if (!org) {
      return sendResponse(res, 404, "Organization not found");
    }

    if (!org.profileImage?.public_id) {
      return sendResponse(res, 400, "No profile image to delete");
    }

    // ✅ Delete from Cloudinary
    await cloudinary.uploader.destroy(org.profileImage.public_id);

    // ✅ Remove from DB
    org.profileImage = null;

    await org.save();

    return sendResponse(res, 200, "Profile Image deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const updateUserProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    const file = req.file;

    if (!file) {
      console.warn("Validation Failed: No file provided");
      return sendResponse(res, 400, "Image is required");
    }

    if (!file.mimetype.startsWith("image/")) {
      console.warn(`Validation Failed: Invalid MimeType - ${file.mimetype}`);
      return sendResponse(res, 400, "Only image is allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
      console.warn(`Validation Failed: File too large - ${file.size}`);
      return sendResponse(res, 400, "Max size is 2MB");
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error(`Error: User with ID ${userId} not found in DB`);
      return sendResponse(res, 404, "User not found");
    }

    // ✅ Delete old image (if exists)
    if (user.profileImage?.public_id) {
      const deleteResult = await cloudinary.uploader.destroy(
        user.profileImage.public_id,
      );
    }

    // ✅ Upload new image

    const result = await uploadToCloudinary(file.buffer);

    if (!result || !result.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    console.log("Cloudinary Upload Success:", {
      url: result.secure_url,
      public_id: result.public_id,
    });

    user.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await user.save();

    return res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("--- Update Profile Image Error ---");
    console.error(`Stack Trace: ${err.stack}`);
    return sendResponse(res, 500, err.message);
  }
};

export const deleteUserProfileImage = async (req, res) => {
  console.log("--- Delete Profile Image Process Started ---");
  console.log("User ID from Request:", req.userId);
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }
    console.log("User found:", user.name);
    console.log("Current Profile Image Data:", user.profileImage);

    if (!user.profileImage?.public_id) {
      return sendResponse(res, 400, "No profile image to delete");
    }

    // ✅ Delete from Cloudinary
    console.log(
      "Attempting to destroy Cloudinary image:",
      user.profileImage.public_id,
    );
    await cloudinary.uploader.destroy(user.profileImage.public_id);

    // ✅ Remove from DB
    user.profileImage = null;

    await user.save();
    console.log("✅ Success: Profile image cleared from Database.");

    return sendResponse(res, 200, "Profile image deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const deleteUploadedFile = async (req, res) => {
  try {
    const { public_id, type } = req.body;

    if (!public_id || !type) {
      return sendResponse(res, 400, "public_id and type are required");
    }

    const resource_type = type === "pdf" ? "raw" : "image";

    await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    return sendResponse(res, 200, "File deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};
