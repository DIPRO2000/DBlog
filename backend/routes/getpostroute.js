import express from "express";
import { getPostsbyUsers, getAllPosts,getPostById } from "../controllers/getPostController.js";

const router=express.Router()

router.get("/getpostofuser/:user_address",getPostsbyUsers); 
router.get("/getallpost",getAllPosts);
router.get("/getpostbyid/:postId",getPostById);

export default router; 