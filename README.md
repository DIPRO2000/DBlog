# DecentBlog

DecentBlog is a decentralized blogging platform built on Ethereum.  
It allows users to create posts, comment on posts, react to content, and view their on-chain activity — all while keeping data censorship-resistant and verifiable.

The project combines **MERN**, **Vite**, **Truffle**, **IPFS**, and **Ethereum smart contracts** to create an end-to-end decentralized blogging experience.

---

## 🚀 Features

- Create on-chain blog posts  
- Comment on any post  
- React to posts and comments (like/dislike)  
- View user-specific activities (My Posts, My Comments)  
- All comments & reactions stored on smart contracts  
- Post content stored via IPFS  
- Wallet-based identity (MetaMask)  
- Backend API for IPFS + metadata handling  
- Fully decentralized core logic

---

## 🛠 Tech Stack

### **Frontend**
- Vite + React
- TailwindCSS
- Ethers.js
- MetaMask integration

### **Backend**
- Node.js + Express
- MongoDB (for auxiliary metadata)
- IPFS (via Pinata)
- REST APIs

### **Blockchain**
- Solidity
- Truffle
- Ganache (local testing)
- Ethereum network (deployment)

---

## 📁 Folder Structure

DecentBlog/  
│── frontend/  
│ ├── src/  
│ └── components/  
│── backend/  
│ ├── routes/  
│ ├── controllers/  
│ └── models/  
│── contracts/  
│── migrations/  
│── truffle-config.js  


---

## ⚙️ Environment Variables

### **Frontend `.env`**
 VITE_Backend_Url=<your_backend_url>
 VITE_MyBlogApp_ADDRESS=<deployed_contract_address>
 VITE_RPC_URL=<rpc_url>
 VITE_IPFS_GATEWAY=<your_ipfs_gateway>


### **Backend `.env`**

---

## 🧩 Smart Contracts (Truffle)

Compile:

truffle compile
Run Ganache (if local):

GUI: open Ganache app

CLI:ganache-cli

Deploy to local Ganache:truffle migrate --reset

After deployment:Copy the contract address from the migration output

Paste it into:

frontend/.env → VITE_MyBlogApp_ADDRESS  
backend/.env → Contract_Address


▶️ 𝐑𝐮𝐧𝐧𝐢𝐧𝐠 𝐭𝐡𝐞 𝐏𝐫𝐨𝐣𝐞𝐜𝐭 𝐋𝐨𝐜𝐚𝐥𝐥𝐲
1. Clone the repo:
 git clone https://github.com/your-username/DecentBlog.git
 cd DecentBlog

2. Backend Setup:
 cd backend
 npm install
 npm start

Backend will run on:𝐡𝐭𝐭𝐩://𝐥𝐨𝐜𝐚𝐥𝐡𝐨𝐬𝐭:𝟑𝟎𝟎𝟎

3. Frontend Setup:
 cd frontend
 npm install
 npm run dev

Frontend will run on:𝐡𝐭𝐭𝐩://𝐥𝐨𝐜𝐚𝐥𝐡𝐨𝐬𝐭:𝟓𝟏𝟕𝟑


 🔗 𝐇𝐨𝐰 𝐀𝐥𝐥 𝐏𝐚𝐫𝐭𝐬 𝐖𝐨𝐫𝐤 𝐓𝐨𝐠𝐞𝐭𝐡𝐞𝐫
| Component      | Purpose                                         |
| -------------- | ----------------------------------------------- |
| Smart Contract | Stores comments, reactions, IDs                 |
| IPFS           | Stores post content & images                    |
| Backend        | Handles IPFS uploads + metadata                 |
| Frontend       | UI + interacting with smart contract via Ethers |


🧪 𝐋𝐨𝐜𝐚𝐥 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐦𝐞𝐧𝐭 𝐅𝐥𝐨𝐰

 𝟏.Start Ganache
 𝟐.Deploy contract using Truffle
 𝟑.Paste deployed address into env files
 𝟒.Start backend
 𝟓.Start frontend
 𝟔.Connect MetaMask to local RPC
 𝟕.Interact with the app


🤝 𝐂𝐨𝐧𝐭𝐫𝐢𝐛𝐮𝐭𝐢𝐧𝐠
 Open to pull requests.
 Create an issue for new features or bug reports.


📄 𝐋𝐢𝐜𝐞𝐧𝐬𝐞
 MIT License.
