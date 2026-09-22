import React, { useState } from 'react';
import { X, Plus, Sparkles, Coins, Layers, Tag } from 'lucide-react';
import { api } from '../api/client';

export default function CreateSkillModal({ isOpen, onClose, onSkillCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    skill_type: 'offer',
    coin_price: 25,
    level: 'Intermediate'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = ['Technology', 'Design', 'Languages', 'Music', 'Business', 'Fitness'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.title || !formData.description) {
        throw new Error("Please fill in the title and description.");
      }

      const res = await api.createSkill(formData);
      onSkillCreated(res);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to post skill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-8 max-w-lg w-full relative border border-purple-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Post New Skill Listing</h2>
          <p className="text-xs text-slate-400">Share your mastery or request 1-on-1 expert mentorship</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Type (Offer vs Request) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, skill_type: 'offer' })}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                formData.skill_type === 'offer'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-900/30'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚡ I Want to Teach (Offer)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, skill_type: 'request' })}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                formData.skill_type === 'request'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-900/30'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              🔍 I Want to Learn (Request)
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Skill Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Masterclass in Python FastAPI & PostgreSQL"
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description & Session Outline</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain what topics will be covered during the 1-on-1 swap session..."
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Expertise Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Beginner" className="bg-slate-900">Beginner</option>
                <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                <option value="Advanced" className="bg-slate-900">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">SkillCoins Price Tag (🪙)</label>
            <input
              type="number"
              min={5}
              max={200}
              value={formData.coin_price}
              onChange={(e) => setFormData({ ...formData, coin_price: parseInt(e.target.value) || 20 })}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full justify-center py-3 text-base mt-2"
          >
            {loading ? "Publishing..." : "Publish Skill Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
