import React, {  useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageCircle, ArrowRight, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CONTRACTS } from '@/config/contract';
import { ethers } from 'ethers';

export default function PostCard({ post, index = 0, commentCount = 0 }) {
  const [liked,setLiked]=useState(false);
  const [disliked,setDisliked]=useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  let tags = [];
  try {
    tags = JSON.parse(post.content?.tags || "[]");
  } catch {
    tags = [];
  }

  useEffect(() =>{
    const fetchReactions = async () => {

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTS.MyBlogApp.address, CONTRACTS.MyBlogApp.abi, signer);
      const userAddress = await signer.getAddress();
      try 
      {
        const hasUpvoted = await contract.hasUpVoted(post.id, userAddress);
        const hasDownvoted = await contract.hasDownVoted(post.id, userAddress);
        setLiked(hasUpvoted);
        setDisliked(hasDownvoted);
      } 
      catch (error) 
      {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  },[post.id]);

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-500"
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Cover Image */}
      {post.content?.imageHash && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={`${import.meta.env.VITE_IPFS_GATEWAY}/${post.content.imageHash}`}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
      )}

      <div className="relative p-6">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-violet-500/10 border-violet-500/30 text-violet-300 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        {/* <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p> */}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(Number(post.timestamp) * 1000), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ThumbsUp className={`w-4 h-4 ${liked ? `fill-violet-500` : ''}`} />
              <span className="text-sm">{post.upvote || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <ThumbsDown className={`w-4 h-4 ${disliked ? 'fill-violet-500' : ``}`} />
              <span className="text-sm">{post.downvote || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{commentCount}</span>
            </div>
          </div>

          <Link
            to={`/Post/${post.id}`}
            className="flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium text-sm group/link"
          >
            Read More
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
