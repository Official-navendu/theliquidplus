'use client';

import * as React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// ==============================================================================
// STATS CARD
// ==============================================================================
interface AdminStatsCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    type: 'up' | 'down';
  };
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function AdminStatsCard({ label, value, trend, icon: Icon, description }: AdminStatsCardProps) {
  return (
    <div className="border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md p-5 rounded-2xl relative group overflow-hidden transition-all duration-300 hover:border-[#FF4D00]/30 text-left text-white">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4D00]/2 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-[#B5B5B5] font-bold block">{label}</span>
          <h3 className="text-xl sm:text-2xl font-black text-white">{value}</h3>
        </div>
        <div className="p-2 rounded-xl bg-black border border-white/5 text-[#B5B5B5] group-hover:text-[#FF4D00] transition-colors duration-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {trend || description ? (
        <div className="flex items-center space-x-2 pt-3 border-t border-white/5 mt-3 text-[10px] uppercase font-bold tracking-wider">
          {trend && (
            <span className={`flex items-center space-x-0.5 ${trend.type === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.type === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              <span>{trend.value}</span>
            </span>
          )}
          {description && <span className="text-[#B5B5B5] font-light">{description}</span>}
        </div>
      ) : null}
    </div>
  );
}

// ==============================================================================
// CHART CARD / PLACEHOLDER
// ==============================================================================
interface AdminChartCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function AdminChartCard({ title, description, children }: AdminChartCardProps) {
  return (
    <div className="border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md p-6 rounded-2xl space-y-4 text-left text-white">
      <div className="border-b border-white/5 pb-3">
        <h4 className="text-xs font-semibold tracking-widest uppercase text-[#E5E5E5]">{title}</h4>
        {description && <p className="text-[9px] text-[#B5B5B5] font-light mt-0.5 uppercase tracking-wider">{description}</p>}
      </div>
      <div className="h-64 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl overflow-hidden relative">
        {children ? (
          children
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
            {/* Visual background lines representing mock chart grid */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 opacity-5 pointer-events-none">
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
            </div>
            {/* Waveform graphic simulating charts */}
            <svg className="w-48 h-12 text-[#FF4D00]/20 animate-pulse" viewBox="0 0 100 20" fill="none">
              <path d="M0,10 Q10,2 20,12 T40,6 T60,16 T80,4 T100,14" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span className="text-[9px] uppercase tracking-widest text-[#B5B5B5] font-bold">
              Sales Distribution Grid Graph
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
