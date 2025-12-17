import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { formatDistanceToNow, set } from 'date-fns';
import { CONTRACTS } from '@/config/contract';
import { ethers } from 'ethers';

export default function Comment({ comment , postId }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [likes, setLikes] = useState(Number(comment.upvote) || 0);
  const [dislikes, setDislikes] = useState(Number(comment.downvote) || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const ReactionCheckerForComments = async () =>{
    try 
    {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTS.MyBlogApp.address, CONTRACTS.MyBlogApp.abi, signer);
      const userAddress = await signer.getAddress();

      const hasUpVoted = await contract.hasUpVotedComment(comment.commentId,userAddress);
      const hasDownVoted = await contract.hasDownVotedComment(comment.commentId,userAddress);

      setUpvoted(hasUpVoted);
      setDownvoted(hasDownVoted);

      return hasUpVoted || hasDownVoted;
    } 
    catch (error) 
    {
      console.error("Error checking reactions for comment:", error);
      return false;
    }
  }

  const handleLike = async () => {
    const alreadyReacted = await ReactionCheckerForComments();
    if(alreadyReacted)
    {
      alert("You have already reacted to this comment");
      return;
    };

    setIsLiking(true);
    
    try 
    {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTS.MyBlogApp.address, CONTRACTS.MyBlogApp.abi, signer);

      const tx = await contract.upvoteComment(postId,comment.commentId);
      await tx.wait();

      setLikes(likes + 1);
    } 
    catch (error) 
    {
      console.error("Error liking comment:", error);
    }

    setIsLiking(false);
    setUpvoted(true);
  };

  const handleDislike = async () => {
    const alreadyReacted = await ReactionCheckerForComments();
    if(alreadyReacted)
    {
      alert("You have already reacted to this comment");
      return;
    };

    setIsDisliking(true);

    try 
    {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTS.MyBlogApp.address, CONTRACTS.MyBlogApp.abi, signer);

      const tx = await contract.downvoteComment(postId,comment.commentId);
      await tx.wait();

      setDislikes(dislikes + 1);
    } 
    catch (error) 
    {
      console.error("Error liking comment:", error);
    }

    setIsDisliking(false);
    setDownvoted(true);
  };

  useEffect(() => {
    ReactionCheckerForComments();
  },[comment]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-white">{comment.commenterName}</span>
            <span className="text-slate-500 text-sm">•</span>
            <span className="text-slate-500 text-sm">
              {formatDistanceToNow(new Date(Number(comment.timestamp)*1000), { addSuffix: true })}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className="h-8 px-3 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
            >
              <ThumbsUp className={`w-4 h-4 mr-1.5 ${upvoted ? 'fill-purple-500' : ''}`} />
              <span className="text-sm">{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              disabled={isDisliking}
              className="h-8 px-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <ThumbsDown className={`w-4 h-4 mr-1.5 ${downvoted ? 'fill-red-500' : ''}`} />
              <span className="text-sm">{dislikes}</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}