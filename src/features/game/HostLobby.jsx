import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGamePin, selectGame } from './gameSlice';
import { selectSortedLeaderboard, selectPlayerCount } from '../player/playersSlice';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Play, Copy, Check, QrCode, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function HostLobby({ onStartGame }) {
  const gamePin = useSelector(selectGamePin);
  const game = useSelector(selectGame);
  const players = useSelector(selectSortedLeaderboard);
  const playerCount = useSelector(selectPlayerCount);

  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const joinUrl = `${window.location.origin}${window.location.pathname}?pin=${gamePin}`;

  const handleCopyPin = () => {
    soundFx.playSelect();
    navigator.clipboard.writeText(gamePin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    soundFx.playSelect();
    onStartGame();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 min-h-[85vh] flex flex-col justify-between animate-fade-in">
      {/* Cyber Game PIN Console Banner */}
      <div className="relative rounded-3xl p-8 border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-indigo-950/90 backdrop-blur-2xl shadow-2xl shadow-purple-950/50 text-center space-y-6 overflow-hidden">
        
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-400/30 text-pink-300 font-black text-xs uppercase tracking-widest shadow-md">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Host Lobby
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-200">
            Join at <span className="gradient-text-primary underline decoration-pink-500">Brain Battle</span> or scan QR code
          </h2>
        </div>

        {/* Futuristic Game PIN Card */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-60 blur-md group-hover:opacity-100 transition duration-500" />
            
            <div className="relative bg-slate-950 px-8 py-5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-6">
              <div className="text-center">
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">
                  GAME PIN CODE
                </div>
                <div className="text-5xl md:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 filter drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                  {gamePin}
                </div>
              </div>

              <button
                onClick={handleCopyPin}
                className="p-3.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-pink-400/40 text-pink-300 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Copy Game PIN"
              >
                {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowQrModal(!showQrModal)}
            className="p-4 glass-panel hover:bg-slate-900 text-slate-300 hover:text-white rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center gap-1.5 text-xs font-black border border-indigo-500/30 hover:border-cyan-400/50 hover:scale-105 active:scale-95"
          >
            <QrCode className="w-7 h-7 text-cyan-400" />
            <span>QR CODE</span>
          </button>
        </div>

        {/* Quiz Title preview */}
        {game.quiz && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Quiz: <span className="text-white font-black">{game.quiz.title}</span> ({game.quiz.questions?.length} Questions)
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel p-8 rounded-3xl max-w-sm w-full text-center space-y-6 border border-cyan-500/40 relative shadow-2xl">
            <h3 className="text-2xl font-black text-white tracking-tight">Scan to Join Battle!</h3>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl border-4 border-cyan-400/30">
              <QRCodeSVG value={joinUrl} size={220} />
            </div>
            <p className="text-slate-300 text-xs font-bold">
              Point phone camera to join PIN <span className="gradient-text-gold font-black text-sm">#{gamePin}</span>
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Joined Players Section */}
      <div className="glass-panel rounded-3xl p-7 flex-1 flex flex-col justify-between space-y-6 border border-indigo-500/20 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Joined Players <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-400/30">{playerCount}</span>
            </h3>
          </div>
          {playerCount === 0 && (
            <span className="text-xs text-amber-400 font-bold animate-pulse flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Waiting for players to join...
            </span>
          )}
        </div>

        {/* Player Chips Grid */}
        <div className="min-h-50 max-h-87.5 overflow-y-auto">
          {playerCount === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Users className="w-12 h-12 stroke-[1.5] text-slate-600 animate-bounce" />
              <p className="text-xs font-semibold text-slate-400">Open another tab or device and enter PIN <span className="text-cyan-400 font-black text-sm">{gamePin}</span></p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="p-3.5 glass-panel rounded-2xl border border-purple-500/30 flex items-center gap-3 animate-fade-in hover:scale-105 transition-all duration-300 bg-slate-900/80 shadow-md"
                >
                  <span className="text-2xl filter drop-shadow-md">{player.avatar || '🚀'}</span>
                  <span className="font-black text-white text-xs truncate">
                    {player.nickname}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start Game Bottom Controller */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-950/60 transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95 border border-emerald-400/30 uppercase tracking-wide"
          >
            <Play className="w-5 h-5 fill-white" /> Start Game Now
          </button>
        </div>
      </div>
    </div>
  );
}
