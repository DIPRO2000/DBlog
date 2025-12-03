import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Loader2, Calendar, User, Wallet, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import LikeDislikeButtons from '@/components/posts/LikeDislikeButtons';
import CommentSection from '@/components/posts/CommentSection';

export default function Post() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const queryClient = useQueryClient();

  const { data: post, isLoading: postLoading, refetch: refetchPost } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => base44.entities.Post.filter({ id: postId }).then((posts) => posts[0]),
    enabled: !!postId,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['postComments', postId],
    queryFn: () => base44.entities.Comment.filter({ post_id: postId }, '-created_date'),
    enabled: !!postId,
  });

  const handleUpdate = () => {
    refetchPost();
    queryClient.invalidateQueries(['posts']);
  };

  const handleCommentAdded = () => {
    refetchComments();
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
          <Link to={('Home')}>
            <Button className="rounded-xl bg-violet-600 hover:bg-violet-500">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Cover Image */}
      {post.cover_image && (
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to={('AllPosts')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Posts
          </Link>
        </motion.div>

        {/* Post Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-violet-500/10 border-violet-500/30 text-violet-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{post.author}</p>
                {post.author_wallet && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    {post.author_wallet.slice(0, 6)}...{post.author_wallet.slice(-4)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.created_date), 'MMMM d, yyyy')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-slate-800/50">
            <LikeDislikeButtons post={post} onUpdate={handleUpdate} />
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Post Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert prose-lg max-w-none mb-12"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-white mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2">{children}</ol>
              ),
              li: ({ children }) => <li className="text-slate-300">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-violet-500 pl-4 italic text-slate-400 my-4">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-slate-800 text-violet-300 px-2 py-1 rounded text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-x-auto my-4">
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-violet-400 hover:text-violet-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="rounded-xl my-6" />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.article>

        {/* Comment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t border-slate-800/50 pt-12"
        >
          <CommentSection
            postId={postId}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </motion.div>
      </div>
    </div>
  );
}