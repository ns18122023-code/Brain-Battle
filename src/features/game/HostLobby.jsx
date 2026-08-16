import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGamePin, selectGame } from './gameSlice';
import { selectSortedLeaderboard, selectPlayerCount } from '../player/playersSlice';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Play, Copy, Check, QrCode, ExternalLink, Sparkles } from 'lucide-react';
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
    if (playerCount === 0) {
      if (!window.confirm("No players have joined yet! Start anyway?")) return;
    }
    soundFx.playSelect();
    onStartGame();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 min-h-[85vh] flex flex-col justify-between">
      {/* Top Banner: Game PIN Display */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-2 border-purple-500/30 text-center space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" /> Host Game Lobby
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-300">
            Join at <span className="text-white font-extrabold underline decoration-purple-500">Kahoot Battle</span> or scan QR code
          </h2>
        </div>

        {/* Big Game PIN */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="bg-slate-950/80 px-8 py-4 rounded-2xl border border-purple-500/50 shadow-2xl flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                GAME PIN
              </div>
              <div className="text-5xl md:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-pink-500 drop-shadow-lg">
                {gamePin}
              </div>
            </div>

            <button
              onClick={handleCopyPin}
              className="p-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-300 rounded-xl transition-all cursor-pointer"
              title="Copy Game PIN"
            >
              {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>

          <button
            onClick={() => setShowQrModal(!showQrModal)}
            className="p-4 glass-card hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl transition-all cursor-pointer flex flex-col items-center gap-1 text-xs font-bold"
          >
            <QrCode className="w-8 h-8 text-purple-400" />
            QR Code
          </button>
        </div>

        {/* Quiz Title preview */}
        {game.quiz && (
          <div className="text-slate-400 text-sm font-medium">
            Quiz: <span className="text-white font-bold">{game.quiz.title}</span> ({game.quiz.questions?.length} Questions)
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl max-w-sm w-full text-center space-y-6 border border-purple-500/40 relative">
            <h3 className="text-2xl font-black text-white">Scan to Join!</h3>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl">
              <QRCodeSVG value={joinUrl} size={220} />
            </div>
            <p className="text-slate-300 text-sm font-medium">
              Point phone camera to join session <span className="font-extrabold text-amber-400">#{gamePin}</span>
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Joined Players Section */}
      <div className="glass-panel rounded-3xl p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-extrabold text-white">
              Joined Players ({playerCount})
            </h3>
          </div>
          {playerCount === 0 && (
            <span className="text-xs text-amber-400 font-semibold animate-pulse">
              Waiting for players to join with PIN #{gamePin}...
            </span>
          )}
        </div>

        {/* Player Chips Grid */}
        <div className="min-h-[200px] max-h-[350px] overflow-y-auto">
          {playerCount === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Users className="w-12 h-12 stroke-[1.5] text-slate-600 animate-bounce" />
              <p className="text-sm font-medium">Open another tab/device and enter PIN <span className="text-purple-400 font-bold">{gamePin}</span></p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="p-3 glass-card rounded-2xl border border-purple-500/30 flex items-center gap-3 animate-fade-in hover:scale-105 transition-transform"
                >
                  <span className="text-2xl">{player.avatar || '🚀'}</span>
                  <span className="font-extrabold text-white text-sm truncate">
                    {player.nickname}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start Game Bottom Controller */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-700/50">
          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-950/60 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Play className="w-6 h-6 fill-white" /> Start Game Now
          </button>
        </div>
      </div>
    </div>
  );
}
