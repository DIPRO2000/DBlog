import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostCard from '@/Components/posts/PostCard';
import { Button } from '@/Components/ui/button';
import { ethers } from 'ethers';

export default function MyPosts() {
  const [loader, setLoader] = useState(true);
  const [posts, setPosts] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const res = await fetch(
          `${import.meta.env.VITE_Backend_Url}/api/getpostofuser/${userAddress}`
        );
        const data = await res.json();

        setPosts(Array.isArray(data) ? data : []);

        // Fetch comments count for each post
        const counts = {};
        await Promise.all(
          data.map(async (post) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_Backend_Url}/api/comments/${post.id}`
              );
              const result = await res.json();
              counts[post.id] = result?.result?.length || 0;
            } catch {
              counts[post.id] = 0;
            }
          })
        );

        setCommentCounts(counts);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      } finally {
        setLoader(false);
      }
    };

    fetchUserPosts();
  }, []);

  if (loader) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  My Posts
                </h1>
                <p className="text-slate-400 text-lg mt-1">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
                </p>
              </div>
            </div>

            <Link to="/CreatePost">
              <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
                <Plus className="w-5 h-5 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No posts yet</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Start sharing your thoughts with the decentralized world. Create your first post today.
            </p>
            <Link to="/CreatePost">
              <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Post
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div key={post.id} className="relative group">
                <PostCard
                  post={post}
                  index={index}
                  commentCount={commentCounts[post.id] || 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
