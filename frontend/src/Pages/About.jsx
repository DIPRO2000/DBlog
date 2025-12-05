import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Zap, Users, Lock, Infinity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'Censorship Resistant',
      description:
        'Your content is stored on a decentralized network, making it impossible for any single entity to remove or modify your posts.',
    },
    {
      icon: Globe,
      title: 'Globally Accessible',
      description:
        'Access your content from anywhere in the world. No geographic restrictions, no barriers to your voice.',
    },
    {
      icon: Lock,
      title: 'True Ownership',
      description:
        'You own your content. Your wallet, your keys, your words. No platform can claim rights to what you create.',
    },
    {
      icon: Infinity,
      title: 'Permanent Storage',
      description:
        'Once published, your content lives forever on the blockchain. Build a legacy that outlasts any platform.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Experience web2 speeds with web3 benefits. Our hybrid architecture ensures a smooth reading experience.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description:
        'Join a community of like-minded writers and readers who value freedom of expression and decentralization.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            About DecentBlog
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Redefining Content{' '}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Ownership
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            We believe in a world where creators have complete control over their content. 
            DecentBlog is more than a platform — it's a movement towards true digital ownership.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-t border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                In an era where platforms can silence voices and algorithms dictate what gets seen, 
                we're building something different. DecentBlog empowers writers to publish their 
                thoughts without fear of censorship or deplatforming.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Every post is cryptographically signed by your wallet and stored on a decentralized 
                network. Your content is truly yours — no one can take it away, modify it without 
                your consent, or prevent others from reading it.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-3xl">D</span>
                    </div>
                    <p className="text-white font-semibold text-lg">DecentBlog</p>
                    <p className="text-slate-500 text-sm">Since 2025</p>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-violet-500/20 border border-violet-500/30"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Decentralized?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Traditional platforms hold all the power. We're giving it back to creators.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Join the Revolution?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Connect your wallet and start writing on a platform that truly respects your voice.
            </p>
            <Link to={('AllPosts')}>
              <Button
                size="lg"
                className="rounded-xl px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-lg group"
              >
                Explore Posts
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}