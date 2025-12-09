import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2,
  MessageCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/config/contract';

export default function MyComments() {
  const [comments, setComments] = useState([]);
  const [postDetails, setPostDetails] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // FIXED: Convert BigInt → normal values
  const normalize = (obj) => {
    if (!obj) return obj;

    const out = {};
    for (let key in obj) {
      const v = obj[key];
      out[key] = typeof v === "bigint" ? Number(v) : v;
    }
    return out;
  };

  // Fetch post from contract
  const fetchPostDetails = async (commentId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      import.meta.env.VITE_MyBlogApp_ADDRESS,
      CONTRACTS.MyBlogApp.abi,
      provider
    );

    const rawPostId = await contract.getPostIdfromComment(commentId);
    const postId = rawPostId;

    const rawPost = await contract.getPostById(postId);
    const cleanPost = rawPost;

    return { id: postId, ...cleanPost };
  };

  // FIXED: Get post title from stored postDetails state
  const getPostTitle = (commentId) => {
    return postDetails[commentId]?.title || "Untitled Post";
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        setUser(userAddress);

        const res = await fetch(
          `${import.meta.env.VITE_Backend_Url}/api/comments/user/${userAddress}`
        );

        const data = await res.json();
        const userComments = data.comments || [];

        // Fetch all post details in parallel — FIXED
        const details = await Promise.all(
          userComments.map((c) => fetchPostDetails(c.id))
        );

        const mapped = {};
        userComments.forEach((c, i) => {
          mapped[c.id] = details[i];
        });

        setPostDetails(mapped);
        setComments(userComments);
        console.log("Loaded comments:", userComments);
        console.log("Post details:", mapped);
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">My Comments</h1>
              <p className="text-slate-400 text-lg mt-1">
                {comments.length} {comments.length === 1 ? "comment" : "comments"} posted
              </p>
            </div>
          </div>
        </motion.div>

        {/* Comment List */}
        {comments.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-6" />
            <h3 className="text-2xl text-white font-bold mb-2">No comments yet</h3>
            <p className="text-slate-500 mb-8">Start engaging with the community.</p>

            <Link to="/AllPosts">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                Explore Posts
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div key={comment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-slate-900/50 p-6 border border-slate-800/50">
                  <div className="mb-3">
                    <Link
                      to={`/Post/${postDetails[comment.id][0]}`}
                      className="text-violet-400 hover:text-violet-300 font-medium text-sm flex items-center gap-1"
                    >
                      Commented on: {postDetails[comment.id] ? postDetails[comment.id][2] : "Loading..."}
                      <ExternalLink className="w-3" />
                    </Link>

                    <p className="text-slate-400 text-xs">
                      {format(new Date(Number(comment.timestamp) * 1000), "MMM d, yyyy • h:mm a")}
                    </p>
                  </div>

                  <p className="text-white mb-4">{comment.content}</p>

                  <div className="flex gap-3 border-t border-slate-800 pt-3">
                    <Badge variant="outline" className="text-slate-400 border-slate-700">
                      <ThumbsUp className="w-3 h-3 mr-1" /> {comment.upvote}
                    </Badge>

                    <Badge variant="outline" className="text-slate-400 border-slate-700">
                      <ThumbsDown className="w-3 h-3 mr-1" /> {comment.downvote}
                    </Badge>
                  </div>

                </Card>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
