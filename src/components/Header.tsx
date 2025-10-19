import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <header className="bg-neutral-900/50 backdrop-blur-2xl border-b border-purple-600/20 sticky top-0 z-40 shadow-md">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-purple-600/5"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 relative">
          <Link to="/" className="flex items-center group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 10 }}
              className="mr-3 relative"
            >
              <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 drop-shadow-[0_0_3px_rgba(167,139,250,0.5)]">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                <line x1="12" y1="22" x2="12" y2="12"></line>
              </svg>
            </motion.div>
            <div>
              <h1 className="text-lg font-display font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent drop-shadow-sm">ARCANE JOBS</h1>
              <p className="text-xs text-neutral-400 font-mono tracking-wider">Track. Apply. Succeed.</p>
            </div>
          </Link>
          
          <div className="flex space-x-3">
              <Link 
                to="/add" 
                className="btn-primary flex items-center py-2 px-4 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Job
              </Link>
          </div>
        </div>
      </div>
    </header>
  );
};