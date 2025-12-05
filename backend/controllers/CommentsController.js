import { ethers } from "ethers";
import { provider } from "../config/ethers.js";
import {createRequire} from "module";
const require = createRequire(import.meta.url);
const MyBlogAbi= require("../../blockchain/build/contracts/MyblogApp.json");
import dotenv from "dotenv";

dotenv.config();

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, MyBlogAbi.abi, provider);

export const getAllCommentsFromPost = async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "No postId provided" });
  }

  try {
    const postComments = await contract.getComments(postId);

    const comments = postComments.map(comment => ({
      commentId: comment.id,
      commenterAddress: comment.commenterAddress,
      commenterName: comment.commenterName,
      content: comment.content,
      upvote: comment.upvote.toString(),
      downvote: comment.downvote.toString(),
      timestamp: comment.timestamp.toString()
    }));

    return res.status(200).json({
      message: "Fetching comments successful",
      result: comments
    });

  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Error fetching comments from blockchain",
      error: error.message
    });
  }
};