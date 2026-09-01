import React from 'react';
import { Activity, RefreshCw, Shield, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  isOnline: boolean;
  isLoading: boolean;
  latencyMs: number | null;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  isLoading,
  latencyMs,
  onRefresh,
}) => {
  return (
    <header id="dashboard-header" className="w-full mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Shield className="w-6 h-6" />
            <motion.div
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#060a13]"
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Internet Route Visualizer
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.4 Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Network &amp; Connection Intelligence Dashboard
            </p>
          </div>
        </div>

        {/* Status indicator & Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Latency badge */}
          {isOnline && latencyMs !== null && (
            <div
              id="latency-indicator"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-white/10 text-xs font-mono text-slate-300"
              title="Estimated connection round-trip latency to edge network"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{latencyMs} ms</span>
            </div>
          )}

          {/* Online Status Pill */}
          <div
            id="online-status-pill"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOnline
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-rose-950/40 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
            }`}
          >
            {isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5" />
                <span>Online</span>
              </>
            ) : (
              <>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-network-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLoading
                ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 cursor-not-allowed opacity-80'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(6,182,212,0.2)] active:scale-95'
            }`}
            aria-label="Refresh network information"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : 'text-slate-400'}`}
            />
            <span>{isLoading ? 'Detecting...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
