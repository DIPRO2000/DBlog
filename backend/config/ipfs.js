import { create } from "ipfs-http-client";

// connect to Infura's IPFS
// const client = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: `Basic ${Buffer.from(
//       process.env.INFURA_PROJECT_ID + ":" + process.env.INFURA_PROJECT_SECRET
//     ).toString('base64')}`,
//   },
// });

const client = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
  
});

export async function uploadJSONToIPFS(jsonData) {
  // stringify JSON first
  const { cid } = await client.add(JSON.stringify(jsonData));
  console.log("IPFS CID:", cid.toString());
//   return `https://ipfs.io/ipfs/${cid}`;
    return cid.toString();
}

export async function uploadPicToIPFS(pic){
  const { cid }=await client.add(pic);
  console.log("IPFS Pic CID:", cid.toString());
  return cid.toString();
}

// Example:
// const myJson = { name: "My blog post", content: "This is content" };
// uploadJSONToIPFS(myJson).then(console.log);
