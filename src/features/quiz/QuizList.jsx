import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllQuizzes, deleteQuizAsync, setActiveQuiz } from './quizSlice';
import { Play, Plus, Edit3, Trash2, HelpCircle, Sparkles, Search } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-500/20">
        <div className="space-y-3 z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" /> Host Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Select or Create a <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-500">Quiz Battle</span>
          </h1>
          <p className="text-slate-300 text-base">
            Launch a live multiplayer game with custom questions, speed-based scoring, and real-time leaderboards.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playSelect();
            onCreateNew();
          }}
          className="z-10 flex items-center gap-2 px-6 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-xl shadow-purple-900/40 transition-all cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-6 h-6" /> Create New Quiz
        </button>

        {/* Ambient background blur circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-white text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Technology', 'General Knowledge', 'Science', 'Pop Culture'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="glass-card rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              {/* Cover Image Header */}
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img
                  src={quiz.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-xs font-bold text-purple-300 border border-slate-700/50">
                  {quiz.category || 'General'}
                </span>

                <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-slate-300">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  {quiz.questions?.length || 0} Questions
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {quiz.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">
                  {quiz.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="p-5 pt-0 flex items-center gap-2">
              <button
                onClick={() => handleStartGame(quiz)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer transform active:scale-95 text-sm"
              >
                <Play className="w-4 h-4 fill-white" /> Start Game
              </button>

              <button
                onClick={() => {
                  soundFx.playSelect();
                  onEditQuiz(quiz);
                }}
                className="p-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Edit Quiz"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => handleDelete(quiz.id, quiz.title, e)}
                className="p-3 bg-slate-800/80 hover:bg-red-600/30 text-slate-400 hover:text-red-300 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-500/30"
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
