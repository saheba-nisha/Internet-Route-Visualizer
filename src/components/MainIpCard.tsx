import React, { useState } from 'react';
import { Building2, Check, Copy, Globe, MapPin, Network, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NetworkInfo } from '../types/network';

interface MainIpCardProps {
  networkInfo: NetworkInfo;
}

export const MainIpCard: React.FC<MainIpCardProps> = ({ networkInfo }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    if (!networkInfo.ip) return;
    try {
      await navigator.clipboard.writeText(networkInfo.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = networkInfo.ip;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      id="main-ip-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl glass-panel-glow p-6 sm:p-8 mb-8 border border-cyan-500/30"
    >
      {/* Background cyber accent gradients */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative cyber grid lines */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-15 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Badges */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium tracking-wider uppercase font-mono">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Your Public IP</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono border border-white/10">
            {networkInfo.ipType}
          </span>
          {networkInfo.asn && (
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 text-[11px] font-mono border border-white/10">
              {networkInfo.asn}
            </span>
          )}
        </div>

        {/* IP Address Display */}
        <div className="my-2 max-w-full overflow-x-auto py-1 px-3">
          <h2
            id="public-ip-display"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          >
            {networkInfo.ip || '---.---.---.---'}
          </h2>
        </div>

        {/* Copy IP Button */}
        <div className="mt-4 mb-6">
          <button
            id="copy-ip-btn"
            onClick={handleCopyIp}
            className={`group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-100 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95'
            }`}
            aria-label="Copy public IP address to clipboard"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">IP copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-cyan-400 group-hover:rotate-6 transition-transform" />
                  <span>Copy IP</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Meta summary beneath IP */}
        <div className="w-full pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300">
          {/* ISP item */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-400">ISP:</span>
            <span className="font-medium text-white truncate max-w-[200px] sm:max-w-[280px]">
              {networkInfo.isp}
            </span>
          </div>

          {/* Location item */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-400">Location:</span>
            <span className="font-medium text-white flex items-center gap-1.5">
              <span>{networkInfo.countryFlag}</span>
              <span>
                {[networkInfo.city, networkInfo.region, networkInfo.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
