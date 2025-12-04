import React, { useState,useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/posts/PostCard';

export default function AllPosts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [posts, setPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data directly
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_Backend_Url}/api/getallpost`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();

        // The backend returns an ARRAY, not {posts: [...]}
        setPosts(Array.isArray(data) ? data : []);
        
        // console.log("Fetched posts:", data);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get all unique tags
  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const getCommentCount = (postId) => {
    return allComments.filter((c) => c.post_id === postId).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            All Posts
          </h1>
          <p className="text-slate-400 text-lg">
            Browse through all the articles written by our decentralized community.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search posts by title, content, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`rounded-xl border-slate-700 ${
                  viewMode === 'grid'
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                    : 'text-slate-400'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={`rounded-xl border-slate-700 ${
                  viewMode === 'list'
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                    : 'text-slate-400'
                }`}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTag(null)}
                className={`rounded-full ${
                  !selectedTag
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                <Filter className="w-4 h-4 mr-1" />
                All
              </Button>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`cursor-pointer transition-all ${
                    tag === selectedTag
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                      : 'border-slate-700 text-slate-400 hover:border-violet-500/30'
                  }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Posts */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-500 text-lg">No posts found matching your criteria.</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                commentCount={getCommentCount(post.id)}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredPosts.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 text-sm mt-8 text-center"
          >
            Showing {filteredPosts.length} of {posts.length} posts
          </motion.p>
        )}
      </div>
    </div>
  );
}