import express from "express";
import { getAllCommentsFromPost } from "../controllers/CommentsController.js";

const router=express.Router()

router.get("/comments/:postId",getAllCommentsFromPost); 

export default router; 