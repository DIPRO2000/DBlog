import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';

export default function Comment({ comment, onUpdate }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    await base44.entities.Comment.update(comment.id, {
      likes: (comment.likes || 0) + 1,
    });
    onUpdate?.();
    setIsLiking(false);
  };

  const handleDislike = async () => {
    setIsDisliking(true);
    await base44.entities.Comment.update(comment.id, {
      dislikes: (comment.dislikes || 0) + 1,
    });
    onUpdate?.();
    setIsDisliking(false);
  };

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
            <span className="font-semibold text-white">{comment.username}</span>
            <span className="text-slate-500 text-sm">•</span>
            <span className="text-slate-500 text-sm">
              {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            {comment.text}
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
              <ThumbsUp className="w-4 h-4 mr-1.5" />
              <span className="text-sm">{comment.likes || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              disabled={isDisliking}
              className="h-8 px-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <ThumbsDown className="w-4 h-4 mr-1.5" />
              <span className="text-sm">{comment.dislikes || 0}</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}