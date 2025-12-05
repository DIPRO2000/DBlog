import React from 'react';
import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Github, Twitter, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
    { icon: Globe, href: '#', label: 'Website' },
  ];

  const footerLinks = [
    { name: 'Home', href: ('') },
    { name: 'All Posts', href: ('AllPosts') },
    { name: 'Create Post', href: ('CreatePost') },
    { name: 'About', href: ('About') },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                DecentBlog
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              A decentralized blogging platform where your content lives forever on the blockchain. Own your words, own your data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-500 hover:text-violet-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/50 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © 2025 DecentBlog. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm flex items-center gap-2">
            Built with
            <span className="text-violet-400">♥</span>
            for the decentralized web
          </p>
        </div>
      </div>
    </footer>
  );
}