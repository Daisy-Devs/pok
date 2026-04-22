import { Organization } from "../models/organization.mjs";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.mjs";

export const uploadDocuments = async (req, res) => {
  try {
    const files = req.files;

    // ✅ 1. Validate count
    if (!files || files.length < 1 || files.length > 5) {
      return res.status(400).json({
        message: "Upload between 1 and 5 files"
      });
    }

    // Allowed types
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg"
    ];

    const uploadedFiles = [];

    // ✅ 2. Validate each file
    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Only PDF and image files are allowed"
        });
      }

      // PDF limit
      if (
        file.mimetype === "application/pdf" &&
        file.size > 10 * 1024 * 1024
      ) {
        return res.status(400).json({
          message: "Each PDF must be <= 10MB"
        });
      }

      // Image limit
      if (
        file.mimetype.startsWith("image/") &&
        file.size > 2 * 1024 * 1024
      ) {
        return res.status(400).json({
          message: "Each image must be <= 2MB"
        });
      }

      // Upload
      const url = await uploadToCloudinary(file.buffer);

      uploadedFiles.push({
        name: file.originalname,
        url,
        type: file.mimetype.startsWith("image/") ? "image" : "pdf"
      });
    }

    // ✅ 3. Response
    return res.status(200).json({
      message: "Files uploaded successfully",
      documents: uploadedFiles
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const uploadCauseImages = async (req, res) => {
  try {
    const files = req.files;

    // ✅ Min / Max count
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least 1 image required" });
    }

    if (files.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed" });
    }

    const uploadedImages = [];

    // ✅ Validate + Upload
    for (const file of files) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files allowed" });
      }

      if (file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "Each image must be <= 2MB" });
      }

      const url = await uploadToCloudinary(file.buffer);

      uploadedImages.push({
        name: file.originalname,
        url,
        type: "image"
      });
    }

    return res.status(200).json({
      message: "Images uploaded successfully",
      images: uploadedImages
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;

    // ✅ Required
    if (!file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // ✅ Type check
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image files allowed" });
    }

    // ✅ Size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ message: "Max size is 2MB" });
    }

    // ✅ Upload to Cloudinary
    const result = await uploadToCloudinary(file.buffer);

    // ✅ Response (IMPORTANT)
    return res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: {
        name: file.originalname,
        url: result.url,
        public_id: result.public_id, // 🔥 IMPORTANT
        type: "image"
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image allowed" });
    }

    if (file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ message: "Max size is 2MB" });
    }

    const org = await Organization.findById(req.ngoId);

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // ✅ Delete old image (if exists)
    if (org.profileImage?.public_id) {
      await cloudinary.uploader.destroy(org.profileImage.public_id);
    }

    // ✅ Upload new image
    const result = await uploadToCloudinary(file.buffer);

    org.profileImage = {
      url: result.url,
      public_id: result.public_id
    };

    await org.save();

    return res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: {
        name: file.originalname,
        url: result.url,
        type: "image"
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const org = await Organization.findById(req.ngoId);

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (!org.profileImage?.public_id) {
      return res.status(400).json({ message: "No profile image to delete" });
    }

    // ✅ Delete from Cloudinary
    await cloudinary.uploader.destroy(org.profileImage.public_id);

    // ✅ Remove from DB
    org.profileImage = null;

    await org.save();

    return res.status(200).json({
      message: "Profile image deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};