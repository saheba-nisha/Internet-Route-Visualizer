import React, { useState } from 'react';
import {
  Building2,
  Check,
  Clock,
  Compass,
  Copy,
  Cpu,
  Globe,
  HardDrive,
  Laptop,
  Layers,
  MapPin,
  Maximize2,
  Monitor,
  Navigation,
  Radio,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeviceInfo, NetworkInfo } from '../types/network';
import { formatLatitude, formatLongitude } from '../services/networkService';

interface InfoGridProps {
  networkInfo: NetworkInfo;
  deviceInfo: DeviceInfo;
}

export const InfoGrid: React.FC<InfoGridProps> = ({ networkInfo, deviceInfo }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const formattedLat = formatLatitude(networkInfo.latitude);
  const formattedLon = formatLongitude(networkInfo.longitude);

  return (
    <section id="network-information-grid" className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Network &amp; Device Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Live browser telemetry and geolocation inspection matrices
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-white/5">
          10 Parameters Active
        </span>
      </div>

      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 or 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Card 1: Location */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-location"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                1. Location
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-label={networkInfo.country}>
                {networkInfo.countryFlag || '📍'}
              </span>
              <h4 className="text-base font-bold text-white truncate">
                {networkInfo.city || 'Unknown City'}
              </h4>
            </div>

            <p className="text-xs text-slate-300">
              {[networkInfo.region, networkInfo.country].filter(Boolean).join(', ')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              ISO: {networkInfo.countryCode || 'N/A'}
            </span>
            <button
              onClick={() =>
                handleCopy(
                  'location',
                  `${networkInfo.city}, ${networkInfo.region}, ${networkInfo.country}`
                )
              }
              className="text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy location"
            >
              {copiedKey === 'location' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 2: Public IP */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-public-ip"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                2. Public IP
              </span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Globe className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-bold font-mono text-cyan-300 truncate">
              {networkInfo.ip}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Public address protocol: {networkInfo.ipType}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">
              {networkInfo.ipType}
            </span>
            <button
              onClick={() => handleCopy('ip', networkInfo.ip)}
              className="text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy IP"
            >
              {copiedKey === 'ip' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 3: ISP & Organization */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-isp"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                3. ISP &amp; Carrier
              </span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2">
              {networkInfo.isp}
            </h4>
            <p className="text-xs text-slate-400 truncate mt-1">
              Org: {networkInfo.org || networkInfo.isp}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-indigo-300">
              {networkInfo.asn || 'AS-Dynamic'}
            </span>
            <button
              onClick={() => handleCopy('isp', `${networkInfo.isp} (${networkInfo.asn})`)}
              className="text-slate-400 hover:text-indigo-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy ISP info"
            >
              {copiedKey === 'isp' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 4: Latitude */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-latitude"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                4. Latitude
              </span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Compass className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-bold font-mono text-white">
              {formattedLat}
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Raw: {networkInfo.latitude !== null ? networkInfo.latitude.toFixed(6) : 'N/A'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Hemisphere: {networkInfo.latitude && networkInfo.latitude >= 0 ? 'Northern' : 'Southern'}
            </span>
            <button
              onClick={() => handleCopy('lat', networkInfo.latitude?.toString() || '')}
              className="text-slate-400 hover:text-sky-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy Latitude"
            >
              {copiedKey === 'lat' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 5: Longitude */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-longitude"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                5. Longitude
              </span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Navigation className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-bold font-mono text-white">
              {formattedLon}
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Raw: {networkInfo.longitude !== null ? networkInfo.longitude.toFixed(6) : 'N/A'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Hemisphere: {networkInfo.longitude && networkInfo.longitude >= 0 ? 'Eastern' : 'Western'}
            </span>
            <button
              onClick={() => handleCopy('lon', networkInfo.longitude?.toString() || '')}
              className="text-slate-400 hover:text-sky-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy Longitude"
            >
              {copiedKey === 'lon' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 6: Timezone */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-timezone"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                6. Timezone
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base font-bold text-white truncate">
              {networkInfo.timezone}
            </h4>
            <p className="text-xs text-amber-300/80 font-mono mt-1">
              Offset: {networkInfo.utcOffset}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 truncate">
              Local: {networkInfo.localTime}
            </span>
            <button
              onClick={() => handleCopy('tz', `${networkInfo.timezone} (${networkInfo.utcOffset})`)}
              className="text-slate-400 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy Timezone"
            >
              {copiedKey === 'tz' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 7: Operating System */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-os"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                7. Operating System
              </span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Laptop className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base font-bold text-white truncate">
              {deviceInfo.os}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Version: {deviceInfo.osVersion || 'Standard Client'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-purple-300">
              Platform Arch
            </span>
            <button
              onClick={() => handleCopy('os', `${deviceInfo.os} ${deviceInfo.osVersion}`)}
              className="text-slate-400 hover:text-purple-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy OS"
            >
              {copiedKey === 'os' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 8: Browser */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-browser"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                8. Browser &amp; Engine
              </span>
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Globe className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base font-bold text-white truncate">
              {deviceInfo.browser}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Engine: {deviceInfo.engine} {deviceInfo.browserVersion && `(v${deviceInfo.browserVersion})`}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-teal-300">
              Web Standards OK
            </span>
            <button
              onClick={() => handleCopy('browser', `${deviceInfo.browser} ${deviceInfo.browserVersion}`)}
              className="text-slate-400 hover:text-teal-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy Browser info"
            >
              {copiedKey === 'browser' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 9: Screen Resolution */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-resolution"
          className="group relative rounded-xl glass-card p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                9. Screen Resolution
              </span>
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Monitor className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-bold font-mono text-white">
              {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Scale: {deviceInfo.devicePixelRatio}x | Depth: {deviceInfo.colorDepth}-bit
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-pink-300 flex items-center gap-1">
              <Maximize2 className="w-3 h-3" /> Dynamic Resize
            </span>
            <button
              onClick={() =>
                handleCopy('res', `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`)
              }
              className="text-slate-400 hover:text-pink-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy Resolution"
            >
              {copiedKey === 'res' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Card 10: Online Status */}
        <motion.div
          whileHover={{ y: -3 }}
          id="card-online-status"
          className={`group relative rounded-xl glass-card p-5 flex flex-col justify-between ${
            deviceInfo.online
              ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
              : 'border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.08)]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                10. Online Status
              </span>
              <div
                className={`p-2 rounded-lg border ${
                  deviceInfo.online
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {deviceInfo.online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  deviceInfo.online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <h4
                className={`text-lg font-bold ${
                  deviceInfo.online ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {deviceInfo.online ? 'Online' : 'Offline'}
              </h4>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {deviceInfo.effectiveType
                ? `Network: ${deviceInfo.effectiveType.toUpperCase()} tier`
                : 'Connection: Direct Socket'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-300">
              navigator.onLine
            </span>
            <span className="text-xs text-slate-400">
              {deviceInfo.online ? 'Active Link' : 'No Signal'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
