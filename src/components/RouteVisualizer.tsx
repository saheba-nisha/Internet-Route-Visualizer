import React, { useState } from 'react';
import {
  Cloud,
  Globe,
  Info,
  Laptop,
  MapPin,
  Network,
  Radio,
  Router,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeviceInfo, NetworkInfo, RouteNodeData } from '../types/network';

interface RouteVisualizerProps {
  networkInfo: NetworkInfo;
  deviceInfo: DeviceInfo;
  latencyMs: number | null;
}

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({
  networkInfo,
  deviceInfo,
  latencyMs,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const isMobileDevice = /Android|iPhone|iPad|Mobile/i.test(deviceInfo.os);

  const nodes: RouteNodeData[] = [
    {
      id: 'device',
      label: 'Origin Hop 01',
      name: 'Your Device',
      badge: 'Client Node',
      status: 'active',
      statusText: 'Connected & Active',
      iconType: 'device',
      details: [
        { label: 'Operating System', value: `${deviceInfo.os} ${deviceInfo.osVersion}` },
        { label: 'Web Browser', value: `${deviceInfo.browser} ${deviceInfo.browserVersion}` },
        { label: 'Rendering Engine', value: deviceInfo.engine },
        { label: 'Display Resolution', value: `${deviceInfo.screenWidth} × ${deviceInfo.screenHeight}` },
        { label: 'Client Interface', value: isMobileDevice ? 'Mobile Cellular / WiFi' : 'Desktop Network Adapter' },
      ],
    },
    {
      id: 'local',
      label: 'Local Hop 02',
      name: 'Local Gateway',
      badge: 'NAT / Router',
      status: 'success',
      statusText: 'Direct Subnet Link',
      iconType: 'local',
      details: [
        { label: 'Network Type', value: 'Local LAN / WiFi Gateway' },
        { label: 'Standard MTU', value: '1500 bytes (Ethernet)' },
        { label: 'Protocol Translation', value: 'IPv4 NAT / IPv6 SLAAC' },
        { label: 'Local Security', value: 'Firewall & Stateful Inspection' },
        { label: 'Link State', value: deviceInfo.online ? 'Carrier Signal Active' : 'Disconnected' },
      ],
    },
    {
      id: 'isp',
      label: 'Core Hop 03',
      name: 'ISP Gateway',
      badge: networkInfo.asn || 'AS-Core',
      status: 'routing',
      statusText: 'Broadband Core Routing',
      iconType: 'isp',
      details: [
        { label: 'Service Provider', value: networkInfo.isp || 'Identified Provider' },
        { label: 'Autonomous System', value: networkInfo.asn || 'Standard AS' },
        { label: 'Organization', value: networkInfo.org || networkInfo.isp },
        { label: 'Transit Protocol', value: networkInfo.ipType },
        { label: 'Access Concentrator', value: 'Regional ISP Point-of-Presence (PoP)' },
      ],
    },
    {
      id: 'internet',
      label: 'Transit Hop 04',
      name: 'Internet Backbone',
      badge: 'Global BGP',
      status: 'routing',
      statusText: 'Global Peering & IXP',
      iconType: 'internet',
      details: [
        { label: 'Routing Architecture', value: 'BGP-4 Border Gateway Protocol' },
        { label: 'Transit Tier', value: 'Global Tier-1 Backbone Carriers' },
        { label: 'Measured Ping / RTT', value: latencyMs !== null ? `~${latencyMs} ms` : 'Measuring...' },
        { label: 'Internet Exchange', value: 'International IXP Fiber Mesh' },
        { label: 'Content Distribution', value: 'Edge Anycast Routing' },
      ],
    },
    {
      id: 'location',
      label: 'Destination Hop 05',
      name: 'Approx. Location',
      badge: networkInfo.countryCode || 'Edge',
      status: 'target',
      statusText: 'Geolocated Edge',
      iconType: 'location',
      details: [
        { label: 'City & Region', value: `${networkInfo.city}, ${networkInfo.region}` },
        { label: 'Country', value: `${networkInfo.country} ${networkInfo.countryFlag}` },
        { label: 'Coordinates', value: `${networkInfo.latitude?.toFixed(4) || '—'}, ${networkInfo.longitude?.toFixed(4) || '—'}` },
        { label: 'Assigned Timezone', value: networkInfo.timezone },
        { label: 'Geo Resolution', value: 'IP Geolocation Center Point (Approximate)' },
      ],
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const renderIcon = (type: RouteNodeData['iconType']) => {
    switch (type) {
      case 'device':
        return isMobileDevice ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />;
      case 'local':
        return <Router className="w-5 h-5" />;
      case 'isp':
        return <Radio className="w-5 h-5" />;
      case 'internet':
        return <Cloud className="w-5 h-5" />;
      case 'location':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Network className="w-5 h-5" />;
    }
  };

  const getNodeColor = (type: RouteNodeData['iconType'], isSelected: boolean) => {
    if (isSelected) {
      return 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)]';
    }
    switch (type) {
      case 'device':
        return 'border-blue-500/40 bg-blue-950/40 text-blue-400 hover:border-blue-400';
      case 'local':
        return 'border-indigo-500/40 bg-indigo-950/40 text-indigo-400 hover:border-indigo-400';
      case 'isp':
        return 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400 hover:border-cyan-400';
      case 'internet':
        return 'border-violet-500/40 bg-violet-950/40 text-violet-400 hover:border-violet-400';
      case 'location':
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400 hover:border-emerald-400';
    }
  };

  return (
    <section id="network-route-section" className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Internet Route Visualization
            </h3>
            <p className="text-xs text-slate-400">
              Interactive structural packet trajectory from your client device to geolocated edge
            </p>
          </div>
        </div>

        {/* Disclaimer Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] text-slate-400 self-start sm:self-auto">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Approximate Network Route</span>
        </div>
      </div>

      {/* Main Glass Visualizer Box */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
        {/* Subtle background animated lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Nodes Container: Grid on Mobile, Flex Row on Desktop */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3 items-center">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const isLast = index === nodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border ${getNodeColor(
                    node.iconType,
                    isSelected
                  )}`}
                >
                  {/* Active Indicator Pin */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {node.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono ${
                        node.status === 'target'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {node.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 group-hover:border-cyan-400/50 transition-colors shrink-0">
                      {renderIcon(node.iconType)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {node.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {node.id === 'device' && `${deviceInfo.os}`}
                        {node.id === 'local' && 'NAT Router'}
                        {node.id === 'isp' && (networkInfo.isp || 'Provider')}
                        {node.id === 'internet' && 'Tier-1 Mesh'}
                        {node.id === 'location' && `${networkInfo.city}`}
                      </p>
                    </div>
                  </div>

                  {/* Node Status Footer */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate">{node.statusText}</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform text-xs font-mono">
                      {isSelected ? '✕' : 'ℹ'}
                    </span>
                  </div>

                  {/* Selection Glow Border Effect */}
                  {isSelected && (
                    <motion.div
                      layoutId="selected-node-glow"
                      className="absolute inset-0 rounded-xl border-2 border-cyan-400 pointer-events-none"
                    />
                  )}
                </motion.div>

                {/* Animated Connection Arrow / Line (Between nodes) */}
                {!isLast && (
                  <>
                    {/* Desktop Horizontal Connection Line */}
                    <div className="hidden md:flex flex-col items-center justify-center -mx-2 z-0">
                      <div className="relative w-full h-1 bg-slate-800 rounded-full overflow-hidden min-w-[20px]">
                        {/* Animated Laser Pulse */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full h-full animate-laser-flow" />
                      </div>
                      <span className="text-[9px] text-cyan-400/80 font-mono mt-1">►</span>
                    </div>

                    {/* Mobile Vertical Connection Line */}
                    <div className="flex md:hidden items-center justify-center py-1">
                      <div className="relative h-6 w-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent w-full h-full animate-laser-flow-vertical" />
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Node Detailed Inspection Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {renderIcon(selectedNode.iconType)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{selectedNode.name} Diagnostic Telemetry</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {selectedNode.label}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Detailed network layer attributes and transmission parameters
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="self-end sm:self-auto text-xs font-mono text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800/80 border border-white/10 hover:border-white/20 transition-colors"
                >
                  Close Details
                </button>
              </div>

              {/* Grid of node properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedNode.details.map((prop, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {prop.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-100 mt-1 break-words">
                      {prop.value || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
