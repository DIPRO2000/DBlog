import { provider } from "../config/ethers.js";
import { ethers } from "ethers";
import axios from "axios";
import MyBlogAbi from "../../blockchain/build/contracts/MyBlogApp.json" with { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, MyBlogAbi.abi, provider);

//Get All Post in blockchain
export const getAllPosts = async (req, res) => {
  
  try {
    // 1. Fetch posts from the contract
    const posts = await contract.getAllPosts();

    // 2. Map + fetch IPFS content
    const postsWithContent = await Promise.all(
      posts.map(async (p) => {
        let contentData = null;
        try {
          // fetch from configured gateway
          const ipfsGateway = process.env.IPFS_GATEWAY;
          const resp = await axios.get(`${ipfsGateway}${p.contentHash}`,{
            headers: {
                "User-Agent": "MyApp/1.0",  // or any string
                "Accept": "application/json"
            }     
          });
          contentData = resp.data; // JSON or string
        } catch (err) {
          console.error(`Error fetching IPFS content for ${p.contentHash}:`, err.message);
        }

        return {
          id: p.id, // bytes32 still bytes-like string
          author: p.author,
          title: p.title,
          content: contentData, // actual content from IPFS
          upvote: p.upvote.toString(),
          downvote: p.downvote.toString(),
          timestamp: p.timestamp.toString(),
        };
      })
    );

    // 3. Return JSON-safe array
    return res.json(postsWithContent);
  } catch (error) {
    console.error("Error fetching User's Posts:", error);
    return res.status(500).json({ message: "Error fetching User's Posts" });
  }
};

//Get all Posts of any User
export const getPostsbyUsers = async (req, res) => {
  const { user_address } = req.body;

  if (!user_address) {
    return res.status(400).json({ message: "A Wallet Address is required" });
  }

  try {
    // 1. Fetch posts from the contract
    const posts = await contract.getAllPostsOfUser(user_address);

    // 2. Map + fetch IPFS content
    const postsWithContent = await Promise.all(
      posts.map(async (p) => {
        let contentData = null;
        try {
          // fetch from configured gateway
          const ipfsGateway = process.env.IPFS_GATEWAY;
          const resp = await axios.get(`${ipfsGateway}${p.contentHash}`,{
            headers: {
                "User-Agent": "MyApp/1.0",  // or any string
                "Accept": "application/json"
            }     
          });
          contentData = resp.data; // JSON or string
        } catch (err) {
          console.error(`Error fetching IPFS content for ${p.contentHash}:`, err.message);
        }

        return {
          id: p.id, // bytes32 still bytes-like string
          author: p.author,
          title: p.title,
          content: contentData, // actual content from IPFS
          upvote: p.upvote.toString(),
          downvote: p.downvote.toString(),
          timestamp: p.timestamp.toString(),
        };
      })
    );

    // 3. Return JSON-safe array
    return res.json(postsWithContent);
  } catch (error) {
    console.error("Error fetching User's Posts:", error);
    return res.status(500).json({ message: "Error fetching User's Posts" });
  }
};


// Get any Post by Id
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    // call contract method
    const post = await contract.getPostById(postId);

    let contentData = null;
    try {
      // fetch from configured gateway
      const ipfsGateway = process.env.IPFS_GATEWAY;
      const resp = await axios.get(`${ipfsGateway}${post[3]}`,{
        headers: {
            "User-Agent": "MyApp/1.0",  // or any string
            "Accept": "application/json"
        }     
      });
      contentData = resp.data; // JSON or string
    } catch (err) {
      console.error(`Error fetching IPFS content for ${post[3]}:`, err.message);
    }

    const formattedPost = {
      id: post[0],
      author: post[1],
      title: post[2],
      content: contentData,
      upvote: Number(post[4]), // BigNumber → number
      downvote: Number(post[5]),
      timestamp: Number(post[6])
    };

    return res.status(200).json({
      success: true,
      post: formattedPost
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching post"
    });
  }
};