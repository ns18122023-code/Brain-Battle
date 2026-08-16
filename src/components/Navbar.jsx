import React, { useState } from 'react';
import { Gamepad2, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFx } from '../services/soundService';

export default function Navbar({ activeMode, onSwitchMode, onLaunchDemo }) {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  const handleToggleSound = () => {
    const nextState = soundFx.toggleSound();
    setSoundEnabled(nextState);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-purple-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSwitchMode('HOST_DASHBOARD')}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-950/50">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">
              Brain <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Battle</span>
            </h1>
          </div>
        </div>

        {/* Navigation Mode Switcher & Quick Demo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="glass-card p-1 rounded-xl flex items-center border border-purple-500/30">
            <button
              onClick={() => {
                soundFx.playSelect();
                onSwitchMode('HOST_DASHBOARD');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${activeMode === 'HOST_DASHBOARD'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              Host Mode
            </button>

            <button
              onClick={() => {
                soundFx.playSelect();
                onSwitchMode('PLAYER');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${activeMode === 'PLAYER'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
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
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-linear-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
            title="Launch multi-player live demo in tabs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Multi-Tab Demo
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2.5 glass-card hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer border border-slate-800"
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
}
