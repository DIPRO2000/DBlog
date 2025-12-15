import { ethers } from "ethers";
import { uploadJSONToIPFS, uploadPicToIPFS } from "../config/ipfs.js";
import { provider } from "../config/ethers.js";
import { createRequire } from "module";
import dotenv from "dotenv";

dotenv.config();

const require = createRequire(import.meta.url);
const MyBlogAbi= require("../blockchain/contracts/MyblogApp.json");

// --- Blockchain Setup ---
let wallet, contract;

if (process.env.ENV === "LOCAL") {
  if (!process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
    throw new Error("Missing PRIVATE_KEY or CONTRACT_ADDRESS in .env");
  }
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, MyBlogAbi.abi, wallet);
}

// --- Upload metadata & image to IPFS ---
export const uploadPostToIPFS = async (req, res) => {
  const { title, tags, content, author } = req.body;

  if (!title || !tags || !content || !author) {
    return res.status(400).json({ message: "Title, tags, author, and content are required" });
  }

  try {
    let imageCid = null;

    if (req.file) {
      // Pass full file object to function
      const imageResponse = await uploadPicToIPFS(req.file);
      imageCid = imageResponse.cid;
      console.log("Uploaded image CID:", imageCid);
    }

    const jsonData = {
      title,
      tags,
      content,
      author,
      imageHash: imageCid || null,
      createdAt: new Date().toISOString(),
    };

    const response = await uploadJSONToIPFS(jsonData);
    const ipfsHash = response.cid;

    return res.status(200).json({
      message: "Post metadata + image uploaded to IPFS",
      imageHash: imageCid,
      ipfsHash,
      ipfsGateway: `https://ipfs.io/ipfs/${ipfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    return res.status(500).json({ message: "Error uploading to IPFS", error: error.message });
  }
};

// --- Store IPFS hash on blockchain (Ganache only) ---
export const createPostOnBlockchain = async (req, res) => {
  const { title, author, ipfsHash } = req.body;

  if (!title) return res.status(400).json({ message: "Title required" });
  if (!author) return res.status(400).json({ message: "Author required" });
  if (!ipfsHash) return res.status(400).json({ message: "IPFS hash required" });

  try {
    if (process.env.ENV !== "LOCAL") {
      return res.status(400).json({ message: "Use frontend MetaMask for testnet" });
    }

    if (!contract) throw new Error("Blockchain contract not initialized");

    const tx = await contract.createPost(author, title, ipfsHash, { gasLimit: 3000000 });
    const receipt = await tx.wait();

    // Parse logs safely using Interface
    const iface = new ethers.utils.Interface(MyBlogAbi.abi);
    const parsedLog = receipt.logs
      .map((log) => {
        try {
          return iface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((l) => l?.name === "Postcreation");

    if (!parsedLog) {
      console.log("Raw receipt logs:", receipt.logs);
      return res.status(500).json({ message: "Postcreation event not found" });
    }

    const { postId, title: _title, author: _author, timestamp } = parsedLog.args;

    return res.status(200).json({
      message: "Post stored on local blockchain",
      txHash: tx.hash,
      postId: postId.toString(),
      title: _title,
      author: _author,
      timestamp: timestamp.toString(),
    });
  } catch (error) {
    console.error("Error creating post on blockchain:", error);
    res.status(500).json({ message: "Error creating post on blockchain", error: error.message });
  }
};
