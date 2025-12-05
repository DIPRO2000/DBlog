import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { base44 } from '@/api/base44Client';
import Comment from './Comment';
import { CONTRACTS } from '@/config/contract';
import { ethers } from 'ethers';

export default function CommentSection({ postId, onCommentAdded }) {
  const [username, setUsername] = useState('');                    
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !text.trim()) return;

    // console.log("Submitting comment:", { postId, username, text });

    try 
    {
      setIsSubmitting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTS.MyBlogApp.address, CONTRACTS.MyBlogApp.abi, signer);
      const userAddress = await signer.getAddress();

      const tx = await contract.addComment(postId, username, text);
      await tx.wait();

      console.log("Comment submitted:", tx);

      setUsername('');
      setText('');
      setIsSubmitting(false);

    } 
    catch (error) {
      console.error("Error submitting comment:", error);
      setIsSubmitting(false);
    }
    
    // onCommentAdded?.();
  };

  useEffect(() =>{

    const fetchComments = async () => {
      try 
      {
        const response =await fetch(`${import.meta.env.VITE_Backend_Url}/api/comments/${postId}`);
        const data = await response.json();
        setComments(data.result);
      } 
      catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

    fetchComments();
  },[postId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Comments</h3>
          <p className="text-slate-500 text-sm">{comments.length} responses</p>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 space-y-4">
        <Input
          placeholder="Your name or wallet address"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl"
        />
        <Textarea
          placeholder="Share your thoughts on this post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !username.trim() || !text.trim()}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Post Comment
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-500">No comments yet. Be the first to share your thoughts!</p>
            </motion.div>
          ) : (
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} onUpdate={onCommentAdded} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}