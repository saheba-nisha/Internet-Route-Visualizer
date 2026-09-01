import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="dashboard-footer" className="w-full mt-12 pt-8 pb-12 border-t border-white/10 text-xs text-slate-400">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Brand Info */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Internet Route Visualizer</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-slate-400 font-normal">Network information dashboard</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Built for network visualization • © {currentYear} All rights reserved.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="max-w-md p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-start gap-2.5 text-left">
          <Lock className="w-4 h-4 text-cyan-400/80 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Privacy Notice:</span> Network information is collected directly from your browser and public IP geolocation services. Location information is approximate.
          </p>
        </div>
      </div>
    </footer>
  );
};
