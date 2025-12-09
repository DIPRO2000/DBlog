import express from "express";
import { getAllCommentsFromPost,getAllCommentsFromUser } from "../controllers/CommentsController.js";

const router=express.Router()

router.get("/comments/:postId",getAllCommentsFromPost); 
router.get("/comments/user/:user_address",getAllCommentsFromUser);

export default router; 