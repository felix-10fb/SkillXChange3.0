import React, { useState, useEffect } from 'react';
import { Search, Filter, Compass, Plus, RefreshCw, BookOpen, Coins } from 'lucide-react';
import { api } from '../api/client';
import SkillCard from '../components/SkillCard';

export default function ExplorePage({ currentUser, onOpenAuth, onOpenCreateSkill, onChatUser, showToast }) {
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Technology', 'Design', 'Languages', 'Music', 'Business', 'Fitness'];

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory, selectedType, searchQuery]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await api.getSkills(selectedCategory, selectedType, searchQuery);
      setSkills(data);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = async (skill) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    try {
      await api.requestExchange({ skill_id: skill.id, note: "Excited to exchange skills!" });
      showToast(`Requested skill swap for "${skill.title}"! 🚀`);
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill listing?")) return;
    try {
      await api.deleteSkill(skillId);
      showToast("Skill deleted successfully.");
      fetchSkills();
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className="mx-4 my-6 space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-8 border-l-4 border-l-[#DE5E44] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#DE5E44] text-xs font-black uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>SKILL MARKETPLACE</span>
          </div>
          <h1 className="text-3xl font-black" style={{ color: '#2C1F56' }}>Explore & Swap Skills</h1>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Browse interactive mentorship offerings or post what you're seeking to learn</p>
        </div>

        <button onClick={() => currentUser ? onOpenCreateSkill() : onOpenAuth()} className="btn-primary text-xs py-2.5 px-4 self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>Post Skill Listing</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pr-2 border-r border-slate-900/10 dark:border-white/10">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Offer vs Request & Search */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-slate-900/5 dark:bg-slate-900/40 p-1 rounded-xl border border-slate-900/10 dark:border-white/10 text-xs font-bold">
            <button
              onClick={() => setSelectedType('All')}
              className={`px-3 py-1 rounded-lg transition-all ${selectedType === 'All' ? 'bg-[#2C1F56] text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('offer')}
              className={`px-3 py-1 rounded-lg transition-all ${selectedType === 'offer' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              ⚡ Offers
            </button>
            <button
              onClick={() => setSelectedType('request')}
              className={`px-3 py-1 rounded-lg transition-all ${selectedType === 'request' ? 'bg-[#DE5E44] text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              🔍 Requests
            </button>
          </div>

          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by title..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5E44]"
            />
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#DE5E44]" />
          <span>Fetching live listings from Neon Postgres...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="glass-panel p-12 text-center my-8 max-w-md mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-[#DE5E44] mx-auto opacity-60" />
          <h3 className="text-xl font-bold text-[#2C1F56] dark:text-white">No Skills Found</h3>
          <p className="text-xs text-slate-500">Post a skill listing to start trading knowledge & earning SkillCoins 🪙</p>
          <button
            onClick={() => currentUser ? onOpenCreateSkill() : onOpenAuth()}
            className="btn-primary text-xs py-2 px-4 inline-flex"
          >
            Post First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              currentUser={currentUser}
              onRequestSwap={handleRequestSwap}
              onChatUser={onChatUser}
              onDeleteSkill={handleDeleteSkill}
            />
          ))}
        </div>
      )}
    </div>
  );
}
