import express from "express";
import { upload } from "../middleware/cloudinaryMulter.mjs";
import { deleteProfileImage, updateProfileImage, uploadCauseImages, uploadDocuments, uploadProfileImage } from "../controllers/uploadController.mjs";

const router = express.Router();

router.post("/documents", upload.array("documents", 5), uploadDocuments);
router.post("/causeImages", upload.array("images", 5), uploadCauseImages);
router.post("/profile", upload.single("profileImage"), uploadProfileImage);
router.post("/updateProfile", upload.single("profileImage"), updateProfileImage);
router.post("/deleteProfile", deleteProfileImage);


export default router;