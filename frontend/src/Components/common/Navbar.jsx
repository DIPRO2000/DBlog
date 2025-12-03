import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, Home, FileText, Info } from 'lucide-react';
import { Button } from '../../Components/ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const navLinks = [
    { name: 'Home', href: '', icon: Home },
    { name: 'All Posts', href: 'AllPosts', icon: FileText },
    { name: 'Create', href: 'CreatePost', icon: FileText },
    { name: 'About', href: 'About', icon: Info },
  ];

  const handleWalletConnect = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={('Home')} className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">D</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              DecentBlog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Wallet Connect Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={handleWalletConnect}
              className={`rounded-xl px-6 transition-all duration-300 ${
                walletConnected
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white'
              }`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {walletConnected ? '0x7a3...f92' : 'Connect Wallet'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <Button
                onClick={handleWalletConnect}
                className="w-full mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {walletConnected ? '0x7a3...f92' : 'Connect Wallet'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}