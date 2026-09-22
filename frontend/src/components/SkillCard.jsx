import React from 'react';
import { Coins, MessageSquare, RefreshCw, Trash2 } from 'lucide-react';

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
    <div className="glass-panel glass-panel-hover p-6 flex flex-col justify-between relative group border border-white/10 hover:border-[#DE5E44]/50 transition-all duration-300 bg-[#1D1438]/90">
      {/* Top Header & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
            isOffer 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : 'bg-[#DE5E44]/20 text-[#FF8F78] border-[#DE5E44]/40'
          }`}>
            {isOffer ? '⚡ Offering Skill' : '🔍 Seeking Mentor'}
          </span>

          <span className="coin-badge text-xs py-0.5 px-2.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{skill.coin_price} 🪙</span>
          </span>
        </div>

        {/* Skill Title */}
        <h3 className="text-xl font-extrabold text-white mb-2 leading-snug font-['Outfit'] group-hover:text-[#FF8F78] transition-colors">
          {skill.title}
        </h3>

        {/* Description */}
        <p className="text-[#C4B9E3] text-xs line-clamp-3 mb-4 leading-relaxed font-medium">
          {skill.description}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        {/* Category & Level Badges */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-[#2C1F56] border border-purple-400/30 text-white font-bold">
            {skill.category}
          </span>
          <span className="font-bold text-slate-300">
            Level: <strong className="text-[#F4D35E]">{skill.level}</strong>
          </span>
        </div>

        {/* Author Details & Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <img 
              src={skill.owner_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${skill.owner_id}`}
              alt="Owner"
              className="w-9 h-9 rounded-full border-2 border-[#DE5E44] bg-slate-800 object-cover"
            />
            <div>
              <div className="text-xs font-black text-white">{skill.owner_name || 'Member'}</div>
              <div className="text-[10px] font-bold text-[#DE5E44]">Skill Host</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Delete button (Owner or Admin) */}
            {(isOwner || isAdmin) && (
              <button 
                onClick={() => onDeleteSkill(skill.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Delete Skill Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {!isOwner && (
              <>
                {/* Chat Button */}
                <button
                  onClick={() => onChatUser(skill.owner_id, skill.owner_name)}
                  className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-xl transition-all"
                  title="Direct Message User"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {/* Request Swap Button */}
                <button
                  onClick={() => onRequestSwap(skill)}
                  className="btn-primary text-xs py-1.5 px-3"
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
