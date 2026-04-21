import { uploadToCloudinary } from "../utils/uploadToCloudinary.mjs";

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
    const files = req.files; // upload.array("images", 5)

    // ✅ Min / Max count
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least 1 image required" });
    }

    if (files.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed" });
    }

    // ✅ Validate each file
    for (const file of files) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files allowed" });
      }

      if (file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "Each image must be <= 2MB" });
      }
    }

    // ✅ Upload all
    const imageUrls = await Promise.all(
      files.map(file => uploadToCloudinary(file.buffer))
    );

    return res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file; // upload.single("profileImage")

    // ✅ Required
    if (!file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // ✅ Type check
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image allowed" });
    }

    // ✅ Size check
    if (file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ message: "Profile image must be <= 2MB" });
    }

    // ✅ Upload
    const url = await uploadToCloudinary(file.buffer);

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImageUrl: url
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};