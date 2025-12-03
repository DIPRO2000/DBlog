import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function LikeDislikeButtons({ post, onUpdate }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    setIsLiking(true);
    await base44.entities.Post.update(post.id, {
      likes: (post.likes || 0) + 1,
      dislikes: disliked ? (post.dislikes || 1) - 1 : post.dislikes,
    });
    setLiked(true);
    setDisliked(false);
    onUpdate?.();
    setIsLiking(false);
  };

  const handleDislike = async () => {
    if (disliked) return;
    setIsDisliking(true);
    await base44.entities.Post.update(post.id, {
      dislikes: (post.dislikes || 0) + 1,
      likes: liked ? (post.likes || 1) - 1 : post.likes,
    });
    setDisliked(true);
    setLiked(false);
    onUpdate?.();
    setIsDisliking(false);
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={`rounded-xl border-slate-700 ${
            liked
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
              : 'text-slate-400 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/10'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 mr-2 ${liked ? 'fill-violet-400' : ''}`} />
          <span>{post.likes || 0}</span>
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDislike}
          disabled={isDisliking}
          className={`rounded-xl border-slate-700 ${
            disliked
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10'
          }`}
        >
          <ThumbsDown className={`w-4 h-4 mr-2 ${disliked ? 'fill-red-400' : ''}`} />
          <span>{post.dislikes || 0}</span>
        </Button>
      </motion.div>
    </div>
  );
}