import React from 'react';
import { Coins, MessageSquare, RefreshCw, Trash2, ShieldCheck, Sparkles, BookOpen, User } from 'lucide-react';

export default function SkillCard({ 
  skill, 
  currentUser, 
  onRequestSwap, 
  onChatUser, 
  onDeleteSkill 
}) {
  const isOwner = currentUser && currentUser.id === skill.owner_id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const isOffer = skill.skill_type === 'offer';

  return (
    <div className="glass-panel glass-panel-hover p-6 flex flex-col justify-between relative group border border-white/10 hover:border-purple-500/40 transition-all duration-300">
      {/* Top Header & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
            isOffer 
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
          }`}>
            {isOffer ? '⚡ Offering Skill' : '🔍 Seeking Mentor'}
          </span>

          <span className="coin-badge text-xs py-0.5 px-2">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span>{skill.coin_price} 🪙</span>
          </span>
        </div>

        {/* Skill Title */}
        <h3 className="text-xl font-bold text-white mb-2 leading-snug font-['Outfit'] group-hover:text-purple-300 transition-colors">
          {skill.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-xs line-clamp-3 mb-4 leading-relaxed">
          {skill.description}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        {/* Category & Level Badges */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300 font-semibold">
            {skill.category}
          </span>
          <span className="font-medium text-slate-400">
            Level: <strong className="text-purple-300">{skill.level}</strong>
          </span>
        </div>

        {/* Author Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src={skill.owner_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${skill.owner_id}`}
              alt="Owner"
              className="w-8 h-8 rounded-full border border-purple-400/30 bg-slate-800 object-cover"
            />
            <div>
              <div className="text-xs font-bold text-slate-200">{skill.owner_name || 'Member'}</div>
              <div className="text-[10px] text-slate-400">Skill Host</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Delete button (Owner or Admin) */}
            {(isOwner || isAdmin) && (
              <button 
                onClick={() => onDeleteSkill(skill.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete Skill Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {!isOwner && currentUser && (
              <>
                {/* Chat Button */}
                <button
                  onClick={() => onChatUser(skill.owner_id, skill.owner_name)}
                  className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-emerald-400 rounded-xl transition-all"
                  title="Direct Message User"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {/* Request Swap Button */}
                <button
                  onClick={() => onRequestSwap(skill)}
                  className="glass-button text-xs py-1.5 px-3"
                  title="Initiate Skill Exchange"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Request Swap</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
