import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveQuizAsync } from './quizSlice';
import { Plus, Trash2, Save, ArrowLeft, CheckCircle2, Clock, Award, Image } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function QuizBuilder({ initialQuiz, onCancel, onSaved }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [category, setCategory] = useState(initialQuiz?.category || 'General Knowledge');
  const [coverImage, setCoverImage] = useState(
    initialQuiz?.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
  );

  const [questions, setQuestions] = useState(
    initialQuiz?.questions || [
      {
        id: 'q_' + Date.now(),
        type: 'mcq',
        question: '',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    ]
  );

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const handleAddQuestion = (type = 'mcq') => {
    soundFx.playSelect();
    const newQ = {
      id: 'q_' + Date.now(),
      type,
      question: '',
      timeLimit: 20,
      points: 1000,
      options:
        type === 'true_false'
          ? [
              { text: 'True', isCorrect: true },
              { text: 'False', isCorrect: false }
            ]
          : [
              { text: '', isCorrect: true },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false }
            ]
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setActiveQuestionIdx(updated.length - 1);
  };

  const handleRemoveQuestion = (idx, e) => {
    e.stopPropagation();
    soundFx.playSelect();
    if (questions.length <= 1) {
      alert("A quiz must have at least 1 question!");
      return;
    }
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(updated);
    setActiveQuestionIdx(Math.min(activeQuestionIdx, updated.length - 1));
  };

  const handleUpdateActiveQuestion = (field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[activeQuestionIdx] = {
        ...updated[activeQuestionIdx],
        [field]: value
      };
      return updated;
    });
  };

  const handleUpdateOption = (optIdx, text) => {
    setQuestions(prev => {
      const updated = [...prev];
      const q = { ...updated[activeQuestionIdx] };
      const opts = [...q.options];
      opts[optIdx] = { ...opts[optIdx], text };
      q.options = opts;
      updated[activeQuestionIdx] = q;
      return updated;
    });
  };

  const handleSetCorrectOption = (optIdx) => {
    soundFx.playSelect();
    setQuestions(prev => {
      const updated = [...prev];
      const q = { ...updated[activeQuestionIdx] };
      q.options = q.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIdx
      }));
      updated[activeQuestionIdx] = q;
      return updated;
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }
    // Validation
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} text cannot be empty!`);
        setActiveQuestionIdx(i);
        return;
      }
      const hasOptionText = q.options.some(o => o.text.trim().length > 0);
      if (!hasOptionText) {
        alert(`Question ${i + 1} must have option text!`);
        setActiveQuestionIdx(i);
        return;
      }
      const hasCorrect = q.options.some(o => o.isCorrect);
      if (!hasCorrect) {
        alert(`Question ${i + 1} must have one correct answer selected!`);
        setActiveQuestionIdx(i);
        return;
      }
    }

    soundFx.playCorrect();

    const quizData = {
      id: initialQuiz?.id || 'quiz_' + Date.now(),
      title,
      description,
      category,
      coverImage,
      questions
    };

    dispatch(saveQuizAsync(quizData)).then(() => {
      if (onSaved) onSaved(quizData);
    });
  };

  const currentQ = questions[activeQuestionIdx];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Quizzes
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer transform active:scale-95"
          >
            <Save className="w-5 h-5" /> Save Quiz
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Questions List & Quiz Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700/50 pb-2">
              Quiz Overview
            </h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="e.g. Master Web Dev Trivia"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Description
              </label>
              <textarea
                placeholder="Brief summary of the quiz..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white text-sm bg-slate-900"
              >
                <option value="Technology">Technology</option>
                <option value="General Knowledge">General Knowledge</option>
                <option value="Science">Science</option>
                <option value="Pop Culture">Pop Culture</option>
              </select>
            </div>
          </div>

          {/* Question List Sidebar */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-200">
                Questions ({questions.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddQuestion('mcq')}
                  className="p-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> MCQ
                </button>
                <button
                  onClick={() => handleAddQuestion('true_false')}
                  className="p-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> T/F
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionIdx(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    activeQuestionIdx === idx
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate text-sm font-medium">
                      {q.question.trim() || '(Untitled Question)'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleRemoveQuestion(idx, e)}
                    className="p-1 hover:text-red-400 transition-colors shrink-0"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Editor Panel: Active Question Editor */}
        <div className="lg:col-span-8">
          {currentQ && (
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              {/* Question Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">
                    Question {activeQuestionIdx + 1}
                  </span>
                  <span className="text-xs uppercase px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md font-semibold border border-slate-700">
                    {currentQ.type === 'true_false' ? 'True / False' : 'Multiple Choice'}
                  </span>
                </h3>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/50 text-sm">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <select
                      value={currentQ.timeLimit}
                      onChange={(e) => handleUpdateActiveQuestion('timeLimit', Number(e.target.value))}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                      <option value={10} className="bg-slate-900">10 Sec</option>
                      <option value={20} className="bg-slate-900">20 Sec</option>
                      <option value={30} className="bg-slate-900">30 Sec</option>
                      <option value={60} className="bg-slate-900">60 Sec</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/50 text-sm">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <select
                      value={currentQ.points}
                      onChange={(e) => handleUpdateActiveQuestion('points', Number(e.target.value))}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                      <option value={500} className="bg-slate-900">500 Pts</option>
                      <option value={1000} className="bg-slate-900">1000 Pts</option>
                      <option value={2000} className="bg-slate-900">2000 Pts</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Question Text Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Question Text
                </label>
                <input
                  type="text"
                  placeholder="Start typing your question here..."
                  value={currentQ.question}
                  onChange={(e) => handleUpdateActiveQuestion('question', e.target.value)}
                  className="w-full glass-input text-lg font-medium rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Options Grid */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center justify-between">
                  <span>Answer Options</span>
                  <span className="text-xs text-slate-400 font-normal">
                    Click the radio checkmark next to the correct answer!
                  </span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((option, optIdx) => {
                    const colors = [
                      'border-red-500/50 bg-red-950/20 text-red-300',
                      'border-blue-500/50 bg-blue-950/20 text-blue-300',
                      'border-amber-500/50 bg-amber-950/20 text-amber-300',
                      'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    ];
                    const symbols = ['▲', '◆', '●', '■'];

                    return (
                      <div
                        key={optIdx}
                        className={`p-4 rounded-xl border-2 transition-all relative flex items-center gap-3 ${
                          option.isCorrect
                            ? 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-950/50'
                            : colors[optIdx % colors.length]
                        }`}
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-lg shrink-0">
                          {symbols[optIdx % symbols.length]}
                        </span>
                        
                        <input
                          type="text"
                          placeholder={`Option ${optIdx + 1}`}
                          value={option.text}
                          onChange={(e) => handleUpdateOption(optIdx, e.target.value)}
                          className="w-full bg-transparent border-b border-slate-700 focus:border-white px-2 py-1 text-white focus:outline-none font-medium"
                        />

                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(optIdx)}
                          className={`p-2 rounded-full transition-all cursor-pointer ${
                            option.isCorrect
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                          title={option.isCorrect ? 'Correct Answer' : 'Set as Correct Answer'}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
