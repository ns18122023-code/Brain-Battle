import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addPlayer, setCurrentPlayer } from './playersSlice';
import { User, Gamepad2, ArrowRight } from 'lucide-react';
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
      <div className="glass-panel p-8 rounded-3xl border-2 border-purple-500/40 shadow-2xl space-y-6 text-center">
        {/* Title Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-950/60 mb-2">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Quiz Battle</span>
          </h2>
          <p className="text-slate-400 text-xs font-semibold">
            {step === 1 ? 'Enter Game PIN to connect' : `Game PIN: #${pin}`}
          </p>
        </div>

        {/* Step 1: PIN Input */}
        {step === 1 && (
          <form onSubmit={handleNextToName} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Game PIN (e.g. 849201)"
                value={pin}
                maxLength={6}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full glass-input text-center text-3xl font-black tracking-widest rounded-2xl py-4 text-amber-300 placeholder:text-slate-600 placeholder:font-normal placeholder:tracking-normal placeholder:text-lg focus:ring-2 focus:ring-purple-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-purple-950/60 transition-all cursor-pointer transform active:scale-95 flex items-center justify-center gap-2"
            >
              Enter PIN <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Step 2: Nickname & Avatar Selection */}
        {step === 2 && (
          <form onSubmit={handleJoin} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-350 mb-1.5 tracking-wider">
                Choose Avatar
              </label>
              <div className="grid grid-cols-6 gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 shadow-inner">
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
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-600 scale-110 shadow-lg shadow-purple-500/40 text-white' 
                        : 'hover:bg-slate-800'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase text-slate-350 tracking-wider">
                  Your Nickname
                </label>
                <span className="text-[10px] font-bold text-slate-500">
                  {nickname.length}/15
                </span>
              </div>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. SpeedDemon"
                    value={nickname}
                    maxLength={15}
                    onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    className="w-full glass-input rounded-2xl pl-11 pr-4 py-3.5 text-white font-bold text-lg focus:ring-2 focus:ring-purple-500/50 shadow-inner"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl flex items-center justify-center transition-all cursor-pointer transform active:scale-95 shadow-md"
                  title="Randomize Name & Avatar"
                >
                  🎲
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-950/60 transition-all cursor-pointer transform active:scale-95"
            >
              OK, Go! 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
