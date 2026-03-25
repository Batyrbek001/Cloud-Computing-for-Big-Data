import { useState, useMemo } from 'react';
import type { ModelType, InfraTier, DbTier } from '../core/math';
import { calculateMonthlyTotal, calculateTCO } from '../core/math';
import { StrategyExportButton } from './StrategyExportButton';
import { Server, Database, Brain, ArrowUpRight } from 'lucide-react';

const MODEL_LABELS: Record<ModelType, string> = {
  baseline: "Linear Baseline (0.5x, $1.00)",
  xgboost: "XGBoost Regressor (1.0x, $5.00)",
  rf: "Random Forest (1.2x, $6.50)",
  nn: "Neural Network v2 (2.5x, $12.00)",
  transformer: "Custom Transformer (4.0x, $25.00)"
};

const INFRA_LABELS: Record<InfraTier, string> = {
  serverless: "Serverless (Pay-as-you-go)",
  vps: "Local VPS ($7.80/mo)",
  azure: "Azure B1s ($7.50/mo)"
};

const DB_LABELS: Record<DbTier, string> = {
  sme: "SME Tier ($15.00/mo)",
  enterprise: "Enterprise Tier ($150.00/mo)"
};

export function Calculator() {
  const [model, setModel] = useState<ModelType>('xgboost');
  const [infra, setInfra] = useState<InfraTier>('vps');
  const [db, setDb] = useState<DbTier>('sme');
  
  const [requests, setRequests] = useState<number>(1000000);
  const [growth, setGrowth] = useState<number>(5);

  const breakdown = useMemo(() => {
    return calculateMonthlyTotal(requests, model, infra, db);
  }, [requests, model, infra, db]);

  const tco12 = useMemo(() => {
    return calculateTCO(breakdown.totalMonthly, growth, 12);
  }, [breakdown.totalMonthly, growth]);

  return (
    <div className="w-full max-w-4xl mx-auto relative group">
      {/* Decorative background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      
      <div className="relative p-8 md:p-12 bg-[#0F111A]/90 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Live Estimator
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Cloud Cost Calculator
          </h1>
          <p className="text-slate-400 font-mono text-sm leading-relaxed max-w-lg">
            // configure your parameters below to deterministically estimate your infrastructure burn rate
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Selectors */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Brain size={14} className="text-cyan-400"/> Compute Engine
            </label>
            <div className="relative">
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value as ModelType)}
                className="w-full p-4 rounded-xl border border-white/5 bg-white/5 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
              >
                {Object.entries(MODEL_LABELS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#0F111A]">{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Server size={14} className="text-blue-400"/> Target Infrastructure
            </label>
            <div className="relative">
              <select 
                value={infra} 
                onChange={(e) => setInfra(e.target.value as InfraTier)}
                className="w-full p-4 rounded-xl border border-white/5 bg-white/5 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {Object.entries(INFRA_LABELS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#0F111A]">{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Database size={14} className="text-purple-400"/> Database Tier
            </label>
            <div className="relative">
              <select 
                value={db} 
                onChange={(e) => setDb(e.target.value as DbTier)}
                className="w-full p-4 rounded-xl border border-white/5 bg-white/5 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
              >
                {Object.entries(DB_LABELS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#0F111A]">{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sliders styled as modern numeric inputs with ranges */}
          <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 p-5 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Est. Monthly Requests</label>
              <span className="text-sm font-bold text-cyan-400">{requests.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="10000000" 
              step="10000"
              value={requests}
              onChange={(e) => setRequests(Number(e.target.value))}
              style={{ accentColor: '#06b6d4' }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 p-5 rounded-xl">
             <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1">
                Data Growth <ArrowUpRight size={12} className="text-emerald-400"/>
              </label>
              <span className="text-sm font-bold text-emerald-400">{growth}% / mo</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="1"
              value={growth}
              onChange={(e) => setGrowth(Number(e.target.value))}
              style={{ accentColor: '#10b981' }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="relative z-10 mt-6 border-t border-white/5 pt-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">Projected Monthly Burn</p>
                <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
                  ${breakdown.totalMonthly.toFixed(2)}
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between text-sm py-1 border-b border-white/5">
                    <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">Compute</span>
                    <span className="text-slate-300 font-medium">${breakdown.computeCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-white/5">
                    <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">Infrastructure</span>
                    <span className="text-slate-300 font-medium">${breakdown.hostingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-white/5">
                    <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">Database</span>
                    <span className="text-slate-300 font-medium">${breakdown.dbCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end gap-6">
                 <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">12-Month Expected TCO</p>
                    <p className="text-3xl font-bold text-white">${tco12.toFixed(2)}</p>
                    <p className="text-xs text-emerald-500/80 mt-2 font-mono tracking-tight">Requires {growth}% compounding scale</p>
                 </div>
                 <StrategyExportButton 
                    modelName={MODEL_LABELS[model]}
                    infraName={INFRA_LABELS[infra]}
                    dbName={DB_LABELS[db]}
                    requests={requests}
                    growth={growth}
                    monthlyTotal={breakdown.totalMonthly}
                    tco={tco12}
                  />
              </div>
           </div>
        </div>
        
        <div className="relative z-10 mt-12 pt-6 border-t border-white/5 text-center">
           <p className="text-[10px] font-mono tracking-[0.4em] text-slate-600 uppercase">
              Cloud · Cost · Estimator · v2.0
           </p>
        </div>

      </div>
    </div>
  );
}
