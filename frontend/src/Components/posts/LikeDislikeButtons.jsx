import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/config/contract';

export default function LikeDislikeButtons({ post }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [upvotes, setUpvotes] = useState(post.upvote || 0);
  const [downvotes, setDownvotes] = useState(post.downvote || 0);

  // One consistent contract
  const CONTRACT = CONTRACTS.MyBlogApp;

  /** 🔍 Check if user already reacted */
  const reactionChecker = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT.address, CONTRACT.abi, signer);
      const userAddress = await signer.getAddress();

      const hasUpvoted = await contract.hasUpVoted(post.id, userAddress);
      const hasDownvoted = await contract.hasDownVoted(post.id, userAddress);

      return { hasUpvoted, hasDownvoted };
    } catch (err) {
      console.error("Error checking reactions:", err);
      return { hasUpvoted: false, hasDownvoted: false };
    }
  };

  /** Load initial reaction state */
  useEffect(() => {
    async function loadReactionState() {
      const { hasUpvoted, hasDownvoted } = await reactionChecker();
      setLiked(hasUpvoted);
      setDisliked(hasDownvoted);
    }
    loadReactionState();
  }, [post.id]);

  /** 👍 LIKE */
  const handleLike = async () => {
    const { hasUpvoted, hasDownvoted } = await reactionChecker();

    if (hasUpvoted || hasDownvoted) {
      alert("You have already voted on this post.");
      return;
    }

    if (isLiking || isDisliking) return;

    try {
      setIsLiking(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT.address, CONTRACT.abi, signer);

      const tx = await contract.upvotePost(post.id);
      await tx.wait();

      setLiked(true);
      setDisliked(false);
      setUpvotes((prev)=> prev + 1);


    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setIsLiking(false);
    }
  };

  /** 👎 DISLIKE */
  const handleDislike = async () => {
    const { hasUpvoted, hasDownvoted } = await reactionChecker();

    if (hasUpvoted || hasDownvoted) {
      alert("You have already voted on this post.");
      return;
    }

    if (isLiking || isDisliking) return;

    try {
      setIsDisliking(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT.address, CONTRACT.abi, signer);

      const tx = await contract.downvotePost(post.id);
      await tx.wait();

      setDisliked(true);
      setLiked(false);
      setDownvotes((prev)=> prev + 1);


    } catch (err) {
      console.error("Error disliking post:", err);
    } finally {
      setIsDisliking(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* LIKE */}
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLike}
          disabled={isLiking || isDisliking}
          className={`rounded-xl border-slate-700 ${
            liked
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
              : 'text-slate-400 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/10'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 mr-2 ${liked ? 'fill-violet-400' : ''}`} />
          <span>{upvotes}</span>
        </Button>
      </motion.div>

      {/* DISLIKE */}
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDislike}
          disabled={isLiking || isDisliking}
          className={`rounded-xl border-slate-700 ${
            disliked
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10'
          }`}
        >
          <ThumbsDown className={`w-4 h-4 mr-2 ${disliked ? 'fill-red-400' : ''}`} />
          <span>{downvotes}</span>
        </Button>
      </motion.div>
    </div>
  );
}
