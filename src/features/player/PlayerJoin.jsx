import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addPlayer, setCurrentPlayer } from './playersSlice';
import { User, Gamepad2, ArrowRight, Sparkles, Zap, ShieldAlert } from 'lucide-react';
import { soundFx } from '../../services/soundService';

const AVATARS = ['🚀', '🦊', '🐯', '⚡', '🐉', '👾', '🦄', '🐼', '🤖', '👑', '🔥', '🎯'];

const ADJECTIVES = [
  'Speedy', 'Brainy', 'Mega', 'Alpha', 'Neon', 'Cosmic', 'Pixel', 'Hyper', 'Super', 
  'Epic', 'Quantum', 'Glitch', 'Sonic', 'Omega', 'Vibrant', 'Shadow', 'Frost', 'Spark'
];

const NOUNS = [
  'Ninja', 'Fox', 'Dragon', 'Bot', 'Phoenix', 'Wizard', 'Cheetah', 'Falcon', 'Glitch', 
  'Titan', 'Rider', 'Hero', 'Spark', 'Rex', 'Beast', 'Gamer', 'Hacker', 'Nova'
];

export default function PlayerJoin({ initialPin, onJoined }) {
  const dispatch = useDispatch();

  const [pin, setPin] = useState(initialPin || '');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('🚀');
  const [step, setStep] = useState(initialPin ? 2 : 1);

  useEffect(() => {
    if (initialPin) {
      setPin(initialPin);
      setStep(2);
    }
  }, [initialPin]);

  const handleNextToName = (e) => {
    e.preventDefault();
    if (!pin || pin.trim().length < 6) {
      alert("Please enter a valid 6-digit Game PIN.");
      return;
    }
    soundFx.playSelect();
    setStep(2);
  };

  const handleShuffle = () => {
    soundFx.playSelect();
    const randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const randNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const randNum = Math.floor(10 + Math.random() * 90);
    setNickname(`${randAdj}${randNoun}${randNum}`);

    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    setAvatar(randomAvatar);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert("Please enter your Nickname!");
      return;
    }

    soundFx.playCorrect();

    const playerId = 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const newPlayerData = {
      id: playerId,
      nickname: nickname.trim(),
      avatar
    };

    dispatch(addPlayer(newPlayerData));
    dispatch(setCurrentPlayer(playerId));

    if (onJoined) {
      onJoined(pin.trim(), newPlayerData);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 min-h-[80vh] flex flex-col justify-center animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl border border-pink-500/30 shadow-2xl shadow-purple-950/60 space-y-6 text-center relative overflow-hidden bg-slate-950/80">
        
        {/* Glow halo */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Title Header */}
        <div className="space-y-3 relative z-10">
          <div className="relative inline-block">
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-75 blur-xs animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto border border-white/20 shadow-xl">
              <Gamepad2 className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">
            Join <span className="gradient-text-primary">Brain Battle</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            {step === 1 ? 'Enter 6-digit PIN Code' : `Connected to PIN #${pin}`}
          </p>
        </div>

        {/* Step 1: PIN Input */}
        {step === 1 && (
          <form onSubmit={handleNextToName} className="space-y-4 relative z-10">
            <div>
              <input
                type="text"
                placeholder="000 000"
                value={pin}
                maxLength={6}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full glass-input text-center text-4xl font-black tracking-widest rounded-2xl py-4.5 text-amber-300 placeholder:text-slate-700 placeholder:font-normal placeholder:text-2xl border-indigo-500/30 focus:border-pink-500 focus:shadow-pink-500/30 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-black text-base rounded-2xl shadow-xl shadow-pink-600/30 transition-all duration-300 cursor-pointer transform active:scale-95 flex items-center justify-center gap-2 border border-white/20 uppercase tracking-wider"
            >
              Enter Game <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Step 2: Nickname & Avatar Selection */}
        {step === 2 && (
          <form onSubmit={handleJoin} className="space-y-5 text-left relative z-10">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-wider">
                Choose Avatar
              </label>
              <div className="grid grid-cols-6 gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shadow-inner">
                {AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      soundFx.playSelect();
                      setAvatar(emoji);
                    }}
                    className={`text-2xl p-2 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-115 active:scale-90 ${
                      avatar === emoji 
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-600 scale-110 shadow-lg shadow-pink-500/50 text-white border border-pink-400/40' 
                        : 'hover:bg-slate-800/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Your Nickname
                </label>
                <span className="text-[10px] font-bold text-slate-500">
                  {nickname.length}/15
                </span>
              </div>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <User className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. SpeedDemon"
                    value={nickname}
                    maxLength={15}
                    onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    className="w-full glass-input rounded-2xl pl-11 pr-4 py-3.5 text-white font-black text-base focus:border-pink-500 shadow-inner"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl flex items-center justify-center transition-all cursor-pointer transform active:scale-95 shadow-md text-xl"
                  title="Randomize Name & Avatar"
                >
                  🎲
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-950/60 transition-all duration-300 cursor-pointer transform active:scale-95 uppercase tracking-wider border border-emerald-400/30"
            >
              Ready, Start! 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
