import { ethers } from "ethers";
import MyBlogApp from "../blockchain/contracts/MyblogApp.json" with { type: "json" };

export const RPC_URL = import.meta.env.VITE_RPC_URL; // e.g. Alchemy, Infura, or local 
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// console.log("Using RPC URL:", RPC_URL);
// console.log("MyBlogApp Contract Address:", import.meta.env.VITE_MyBlogApp_ADDRESS);

export const CONTRACTS = {
  MyBlogApp: {
    address: `${import.meta.env.VITE_MyBlogApp_ADDRESS}`, // replace after deploy
    abi: MyBlogApp.abi,
  },
};