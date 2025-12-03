import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function AnimatedHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const features = [
    { icon: Shield, text: 'Censorship Resistant' },
    { icon: Globe, text: 'Globally Distributed' },
    { icon: Sparkles, text: 'Forever Stored' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm">
              <Sparkles className="w-4 h-4" />
              Web3 Native Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Your Voice,{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unchained
              </span>
              <motion.span
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Write fearlessly on a decentralized platform where your content belongs to you. 
            No gatekeepers, no censorship, just pure expression stored forever on the blockchain.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to={('AllPosts')}>
              <Button
                size="lg"
                className="rounded-xl px-8 py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-lg group"
              >
                Start Reading
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={('About')}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 py-6 border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white text-lg"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: `${index * 0.5}s` }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-300"
              >
                <feature.icon className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 w-32 h-32 border border-violet-500/20 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-10 w-24 h-24 border border-purple-500/20 rounded-full hidden lg:block"
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}