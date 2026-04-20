import express from "express";
import { upload } from "../middleware/cloudinaryMulter.mjs";
import { uploadCauseImages, uploadDocuments, uploadProfileImage } from "../controllers/uploadController.mjs";

const router = express.Router();

router.post("/documents", upload.array("documents", 5), uploadDocuments);
router.post("/causeImages", upload.array("images", 5), uploadCauseImages);
router.post("/profile", upload.single("profileImage"), uploadProfileImage);

export default router;