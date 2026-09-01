import React, { useEffect, useState, useCallback } from 'react';
import {
  AlertTriangle,
  Compass,
  Loader2,
  RefreshCw,
  Shield,
  Wifi,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { MainIpCard } from './components/MainIpCard';
import { RouteVisualizer } from './components/RouteVisualizer';
import { InfoGrid } from './components/InfoGrid';
import { Footer } from './components/Footer';
import { DeviceInfo, NetworkInfo } from './types/network';
import {
  fetchNetworkInfo,
  getDeviceInfo,
  measureLatency,
} from './services/networkService';

export default function App() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync browser/device state
  const syncDeviceInfo = useCallback(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  // Fetch all network telemetry data
  const loadNetworkData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    // Refresh device info alongside
    syncDeviceInfo();

    try {
      // Parallelize network IP fetch + latency ping
      const [netData, ping] = await Promise.all([
        fetchNetworkInfo(),
        measureLatency(),
      ]);

      setNetworkInfo(netData);
      setLatencyMs(ping);
    } catch (err) {
      console.error('Error fetching network intelligence:', err);
      setError(
        (err as Error).message ||
          'Unable to retrieve network information. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [syncDeviceInfo]);

  // Initial load & window event listeners
  useEffect(() => {
    loadNetworkData();

    // Event listeners
    const handleOnline = () => {
      syncDeviceInfo();
      loadNetworkData(true);
    };

    const handleOffline = () => {
      syncDeviceInfo();
      setLatencyMs(null);
    };

    const handleResize = () => {
      syncDeviceInfo();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, [loadNetworkData, syncDeviceInfo]);

  return (
    <div className="relative min-h-screen bg-[#060a13] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">
      {/* Dynamic ambient cyber background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-cyan-900/15 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-950/20 blur-[130px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <Header
          isOnline={deviceInfo.online}
          isLoading={isLoading || isRefreshing}
          latencyMs={latencyMs}
          onRefresh={() => loadNetworkData(true)}
        />

        {/* Content Area */}
        <main id="dashboard-main-content">
          <AnimatePresence mode="wait">
            {/* 1. Initial Full Loading State */}
            {isLoading && !networkInfo && !error && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center min-h-[420px] rounded-2xl glass-panel p-8 sm:p-12 text-center my-8 border border-white/10"
              >
                {/* Cyber Radar Animation */}
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                  {/* Radar Circles */}
                  <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-2 rounded-full border border-cyan-500/30" />
                  <div className="absolute inset-6 rounded-full border border-cyan-500/40" />

                  {/* Rotating Sweeper */}
                  <div className="absolute inset-0 rounded-full animate-radar origin-center bg-gradient-to-tr from-cyan-500/30 via-transparent to-transparent" />

                  {/* Central Node Icon */}
                  <div className="relative z-10 p-3 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Compass className="w-6 h-6 animate-spin text-cyan-400" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  Detecting network information...
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Querying public IP registry, autonomous system (ASN), browser telemetry, and geographical edge routes.
                </p>

                <div className="mt-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono text-cyan-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Scanning network interfaces</span>
                </div>
              </motion.div>
            )}

            {/* 2. Error State */}
            {error && !networkInfo && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center justify-center min-h-[380px] rounded-2xl glass-panel p-8 sm:p-12 text-center my-8 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
              >
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-5">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Network information unavailable
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                  {error}
                </p>
                <button
                  id="retry-network-btn"
                  onClick={() => loadNetworkData(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-300 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Network Scan</span>
                </button>
              </motion.div>
            )}

            {/* 3. Successful Dashboard View */}
            {networkInfo && (
              <motion.div
                key="dashboard-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* 1. Main Public IP Highlight Card */}
                <MainIpCard networkInfo={networkInfo} />

                {/* 2. Visual Internet Route Section */}
                <RouteVisualizer
                  networkInfo={networkInfo}
                  deviceInfo={deviceInfo}
                  latencyMs={latencyMs}
                />

                {/* 3. 10 Telemetry Information Cards Grid */}
                <InfoGrid
                  networkInfo={networkInfo}
                  deviceInfo={deviceInfo}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
