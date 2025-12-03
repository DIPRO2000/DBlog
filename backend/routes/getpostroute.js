import express from "express";
import { getPostsbyUsers, getAllPosts,getPostById } from "../controllers/getPostController.js";

const router=express.Router()

router.post("/getpostofuser",getPostsbyUsers); 
router.get("/getallpost",getAllPosts);
router.get("/getpostbyid/:postId",getPostById);

export default router; 