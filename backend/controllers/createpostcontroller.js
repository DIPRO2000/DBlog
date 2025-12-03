import { ethers } from "ethers";
import { uploadJSONToIPFS, uploadPicToIPFS } from "../config/ipfs.js";
import { provider } from "../config/ethers.js"; 
import MyBlogAbi from "../../blockchain/build/contracts/MyBlogApp.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

// --- Blockchain Setup ---
let wallet, contract;

if (process.env.ENV === "LOCAL") {
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, MyBlogAbi.abi, wallet);
}

// --- Upload metadata & image to IPFS ---
export const uploadPostToIPFS = async (req, res) => {
  const { title, tags, content, author } = req.body;

  if (!title || !tags || !content || !author) {
    return res.status(400).json({ message: "Title, tags, Author and content are required" });
  }

  try {
    let imageHash = null;

    // If user uploaded a file, push it to IPFS first
    if (req.file) {
      imageHash = await uploadPicToIPFS(req.file.buffer); // directly get the CID string
      console.log("Uploaded image CID:", imageHash);
    }

    // Build metadata JSON
    const jsonData = {
      title,
      tags,
      content,
      author,
      imageHash, // IPFS hash of the image
      createdAt: new Date().toISOString(),
    };

    // Upload metadata JSON to IPFS
    const cid = await uploadJSONToIPFS(jsonData);
    const ipfsHash = cid.toString();

    return res.status(200).json({
      message: "Post metadata + image uploaded to IPFS",
      imageHash, // direct hash of the image file
      ipfsHash,  // hash of the metadata JSON
      ipfsGateway: `https://ipfs.io/ipfs/${ipfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    return res.status(500).json({ message: "Error uploading to IPFS" });
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

    const tx = await contract.createPost(author, title, ipfsHash, { gasLimit: 3000000 });
    const receipt = await tx.wait();

    // --- Fetch event from logs if receipt.events is undefined ---
    const log = receipt.logs.find(l => l.event === "Postcreation" || l.topics[0]); // fallback
    if (!log) {
      console.log(receipt);
      return res.status(500).json({ message: "Postcreation event not found" });
    }

    const args = log.args || log; // Ganache sometimes uses numeric keys
    const postId = args[0].toString();
    const _title = args[1];
    const _author = args[2];
    const timestamp = args[3].toString();

    return res.status(200).json({
      message: "Post stored on local blockchain",
      txHash: tx.hash,
      postId,
      title: _title,
      author: _author,
      timestamp,
    });
  } catch (error) {
    console.error("Error creating post on blockchain:", error);
    res.status(500).json({ message: "Error creating post on blockchain", error: error.message });
  }
};

