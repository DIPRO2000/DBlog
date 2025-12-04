import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

export async function uploadJSONToIPFS(jsonData, options = {}) {
  try {
    const data = new FormData();

    data.append(
      "pinataMetadata",
      JSON.stringify({
        name: options.name || `json-${Date.now()}`,
        keyvalues: options.metadata || {}
      })
    );

    data.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: options.cidVersion || 0
      })
    );

    data.append("file", Buffer.from(JSON.stringify(jsonData)), {
      filename: options.name || `data-${Date.now()}.json`,
      contentType: "application/json",
    });

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_API_SECRET,
        },
      }
    );

    const cid = response.data.IpfsHash;

    return {
      cid,
      ipfsUrl: `ipfs://${cid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      publicUrl: `https://ipfs.io/ipfs/${cid}`,
    };
  } catch (error) {
    console.error("JSON upload failed:", error.message);
    throw error;
  }
}

export async function uploadPicToIPFS(file, options = {}) {
  try {
    if (!file) throw new Error("No file provided");
    console.log("PinataAPI Key:", process.env.PINATA_API_KEY ? "Exists" : "Missing");
    console.log("PinataAPI Secret:", process.env.PINATA_API_SECRET ? "Exists" : "Missing");

    const data = new FormData();

    let buffer = Buffer.isBuffer(file.buffer)
      ? file.buffer
      : Buffer.from(file.buffer);

    const stream = Readable.from(buffer);

    data.append("file", stream, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    data.append(
      "pinataMetadata",
      JSON.stringify({
        name: file.originalname || `image-${Date.now()}`,
        keyvalues: options.metadata || {},
      })
    );

    data.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 0,
      })
    );

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_API_SECRET,
        },
      }
    );

    return {
      cid: response.data.IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error("Image upload failed:", error.message);
    throw error;
  }
}
