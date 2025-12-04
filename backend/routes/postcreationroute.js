import express from "express";
import { upload } from "../config/multer.js";
import { uploadPostToIPFS, createPostOnBlockchain } from "../controllers/createpostcontroller.js";

const router = express.Router();

router.post("/uploadPostToIPFS", upload.single("image"), uploadPostToIPFS);
router.post("/uploadPostToBlockchain", upload.none(),createPostOnBlockchain);

export default router;
