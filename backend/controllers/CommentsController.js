import { ethers } from "ethers";
import { provider } from "../config/ethers.js";
import MyBlogAbi from "../../blockchain/build/contracts/MyBlogApp.json" with { type: "json" };
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
      timestamp: new Date(Number(comment.timestamp) * 1000).toISOString()
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