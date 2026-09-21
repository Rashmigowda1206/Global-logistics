import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, ShieldCheck, CheckCircle2, ArrowRight, Terminal } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(15);

  const logs = [
    'Initializing TRANSITIQ Core Telemetry Engine...',
    'Establishing secure satellite link to 128 global container terminals...',
    'Loading live AIS vessel transponders and air cargo manifests...',
    'Synthesizing delay probability algorithms & chokepoint models...',
    'Network Connected ✓'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => { setStep(1); setProgress(42); }, 350);
    const timer2 = setTimeout(() => { setStep(2); setProgress(70); }, 750);
    const timer3 = setTimeout(() => { setStep(3); setProgress(88); }, 1150);
    const timer4 = setTimeout(() => { setStep(4); setProgress(100); }, 1550);
    const timer5 = setTimeout(() => { onComplete(); }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#040711] flex flex-col items-center justify-center p-6 select-none font-mono">
      {/* Subtle background radar circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-96 h-96 rounded-full border border-cyan-500/40 animate-ping"></div>
        <div className="w-[500px] h-[500px] rounded-full border border-cyan-500/20"></div>
        <div className="w-[700px] h-[700px] rounded-full border border-slate-800"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#070D21]/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-hud">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-slate-100">
              TRANSIT<span className="text-cyan-400">IQ</span>
            </h1>
            <p className="text-[11px] text-slate-400 tracking-tight">
              GLOBAL LOGISTICS CONTROL TOWER
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Synchronizing Telemetry</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full shadow-hud"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Console Log Stream */}
        <div className="p-3 bg-[#030612] rounded-lg border border-slate-800/80 space-y-1 text-xs mb-5 min-h-[90px]">
          {logs.slice(0, step + 1).map((log, index) => (
            <div
              key={index}
              className={`flex items-center space-x-1.5 ${
                index === 4 ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Terminal className="w-3 h-3 text-cyan-500 flex-shrink-0" />
              <span className="truncate">{log}</span>
            </div>
          ))}
        </div>

        {/* Skip button for instant enter */}
        <button
          onClick={onComplete}
          className="w-full py-2.5 px-4 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-hud"
        >
          <span>Enter Command Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
