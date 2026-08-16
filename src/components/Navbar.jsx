import React, { useState } from 'react';
import { Gamepad2, Volume2, VolumeX, Sparkles, Zap } from 'lucide-react';
import { soundFx } from '../services/soundService';

export default function Navbar({ activeMode, onSwitchMode, onLaunchDemo }) {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  const handleToggleSound = () => {
    const nextState = soundFx.toggleSound();
    setSoundEnabled(nextState);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-indigo-500/20 px-4 py-3 shadow-2xl shadow-slate-950/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Cyber Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSwitchMode('HOST_DASHBOARD')}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-70 blur-xs group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/20">
              <Gamepad2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white flex items-center gap-1">
              Brain <span className="gradient-text-primary">Battle</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300 uppercase tracking-widest hidden sm:inline-block">PRO</span>
            </h1>
          </div>
        </div>

        {/* Navigation Mode Switcher & Quick Demo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="glass-card p-1 rounded-2xl flex items-center border border-indigo-500/30 shadow-inner bg-slate-900/80">
            <button
              onClick={() => {
                soundFx.playSelect();
                onSwitchMode('HOST_DASHBOARD');
              }}
              className={`px-3.5 sm:px-5 py-1.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${activeMode === 'HOST_DASHBOARD' || activeMode === 'HOST_GAME' || activeMode === 'HOST_BUILDER'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-300" /> Host Mode
            </button>

            <button
              onClick={() => {
                soundFx.playSelect();
                onSwitchMode('PLAYER');
              }}
              className={`px-3.5 sm:px-5 py-1.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${activeMode === 'PLAYER'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 border border-pink-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              Player Mode
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playSelect();
              if (onLaunchDemo) onLaunchDemo();
            }}
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-400/30 text-amber-300 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 hover:scale-105 active:scale-95"
            title="Launch multi-player live demo in tabs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Quick Multi-Tab Demo
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2.5 glass-card hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer border border-indigo-500/20 hover:border-indigo-400/40 hover:scale-105 active:scale-95"
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
}
