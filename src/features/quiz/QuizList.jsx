import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllQuizzes, deleteQuizAsync, setActiveQuiz } from './quizSlice';
import { Play, Plus, Edit3, Trash2, HelpCircle, Sparkles, Search, Flame, Zap, Layers } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function QuizList({ onCreateNew, onEditQuiz, onStartGame }) {
  const dispatch = useDispatch();
  const quizzes = useSelector(selectAllQuizzes);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    soundFx.playSelect();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      dispatch(deleteQuizAsync(id));
    }
  };

  const handleStartGame = (quiz) => {
    soundFx.playSelect();
    dispatch(setActiveQuiz(quiz));
    if (onStartGame) onStartGame(quiz);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* High-Tech Futuristic Hero Banner */}
      <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950/90 backdrop-blur-2xl shadow-2xl shadow-purple-950/40 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Animated Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="space-y-4 z-10 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-950/50">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Brain Battle Arena
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Launch or Craft a <span className="gradient-text-primary">Brain Battle</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
            Host live interactive quiz battles with real-time multiplayer speed scoring, instant tab sync, and dynamic podium rank showdowns.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-purple-400" /> {quizzes.length} Quizzes Ready</span>
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-400" /> Real-time Cloud Sync</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playSelect();
            onCreateNew();
          }}
          className="z-10 relative group flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-black rounded-2xl shadow-xl shadow-pink-600/30 transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95 shrink-0 border border-white/20"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          <span>Create New Quiz</span>
        </button>

        {/* Ambient background glowing orbs */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Futuristic Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="relative w-full md:w-85">
          <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search battles by topic or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input rounded-xl pl-11 pr-4 py-2.5 text-white text-xs font-semibold placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {['All', 'Technology', 'General Knowledge', 'Science', 'Pop Culture'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400/40 shadow-md shadow-pink-600/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cyber Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="glass-panel-interactive rounded-3xl overflow-hidden group flex flex-col justify-between border border-slate-800 hover:border-pink-500/40 shadow-xl"
          >
            <div>
              {/* Card Cover Image */}
              <div className="h-48 relative overflow-hidden bg-slate-950">
                <img
                  src={quiz.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl text-[11px] font-black text-cyan-300 border border-cyan-500/30 uppercase tracking-wider shadow-md">
                  {quiz.category || 'General'}
                </span>

                <span className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl text-xs font-bold text-amber-300 border border-amber-500/30 shadow-md">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  {quiz.questions?.length || 0} Questions
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {quiz.title}
                </h3>
                <p className="text-slate-400 text-xs font-medium line-clamp-2 min-h-9 leading-relaxed">
                  {quiz.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 pt-0 flex items-center gap-2.5">
              <button
                onClick={() => handleStartGame(quiz)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-xl shadow-lg shadow-emerald-950/60 transition-all duration-300 cursor-pointer transform active:scale-95 text-xs tracking-wide uppercase border border-emerald-400/30"
              >
                <Play className="w-4 h-4 fill-white" /> Start Game
              </button>

              <button
                onClick={() => {
                  soundFx.playSelect();
                  onEditQuiz(quiz);
                }}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer border border-slate-800 hover:border-slate-700"
                title="Edit Quiz"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => handleDelete(quiz.id, quiz.title, e)}
                className="p-3 bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer border border-slate-800 hover:border-rose-500/40"
                title="Delete Quiz"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
