import { uploadToCloudinary } from "../utils/uploadToCloudinary.mjs";

export const uploadDocuments = async (req, res) => {
  try {
    const files = req.files; // upload.array("documents", 5)

    // ✅ Min / Max count
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least 1 document required" });
    }

    if (files.length > 5) {
      return res.status(400).json({ message: "Max 5 documents allowed" });
    }

    // ✅ Validate each file
    for (const file of files) {
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF files allowed" });
      }

      if (file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: "Each PDF must be <= 10MB" });
      }
    }

    // ✅ Upload all
    const urls = await Promise.all(
      files.map(file => uploadToCloudinary(file.buffer))
    );

    // ✅ Format response
    const documents = urls.map((url, i) => ({
      name: files[i].originalname,
      url
    }));

    return res.status(200).json({
      message: "Documents uploaded successfully",
      documents
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
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