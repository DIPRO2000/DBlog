import express from "express";
import multer from "multer";
import { uploadPostToIPFS, createPostOnBlockchain } from "../controllers/createpostcontroller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory buffer

router.post("/uploadPostToIPFS", upload.single("image"), uploadPostToIPFS);
router.post("/uploadPostToBlockchain", upload.none(),createPostOnBlockchain);

export default router;
