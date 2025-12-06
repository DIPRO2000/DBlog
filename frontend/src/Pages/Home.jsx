import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp } from 'lucide-react';
import AnimatedHero from '@/components/home/AnimatedHero';
import PostCard from '@/components/posts/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_Backend_Url}/api/getallpost`);

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        const postArray = Array.isArray(data) ? data : [];
        setPosts(postArray);

        // Fetch all comment counts in parallel
        const counts = {};
        await Promise.all(
          postArray.map(async (post) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_Backend_Url}/api/comments/${post.id}`
              );
              const data = await res.json();
              counts[post.id] = data?.result?.length || 0;
            } catch {
              counts[post.id] = 0;
            }
          })
        );

        setCommentCounts(counts);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-slate-950">
      <AnimatedHero />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-4">
              <TrendingUp className="w-4 h-4" />
              Latest Posts
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Fresh from the Blockchain
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Explore the latest thoughts, ideas, and insights from our community of decentralized writers.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">No posts yet. Be the first to write!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  commentCount={commentCounts[post.id] || 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Posts', value: posts.length, suffix: '+' },
              { label: 'Active Writers', value: 12, suffix: '+' },
              { label: 'Comments', value: Object.values(commentCounts).reduce((a, b) => a + b, 0), suffix: '+' },
              { label: 'Uptime', value: 99.9, suffix: '%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
