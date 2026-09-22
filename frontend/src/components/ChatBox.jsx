import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, User, Sparkles, RefreshCw, CheckCheck } from 'lucide-react';
import { api } from '../api/client';

export default function ChatBox({ isOpen, onClose, currentUser, activeContact, setActiveContact }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadConversations();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (activeContact) {
      loadMessages(activeContact.id);
      const interval = setInterval(() => {
        loadMessages(activeContact.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const convs = await api.getConversations();
      setConversations(convs);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const msgs = await api.getMessages(otherUserId);
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const content = inputText;
    setInputText('');

    try {
      const newMsg = await api.sendMessage(activeContact.id, content);
      setMessages((prev) => [...prev, newMsg]);
      loadConversations();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 md:w-[480px] h-[580px] glass-panel border border-emerald-500/30 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">SkillXChange Live Chat</h3>
            <p className="text-[10px] text-emerald-400 font-medium">Connect & Plan Mentorship Sessions</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Sidebar Conversations List */}
        <div className="col-span-5 border-r border-white/10 bg-slate-950/40 p-2 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
            Contacts ({conversations.length})
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-8 px-2 text-slate-500 text-xs">
              No conversations yet. Click "Chat" on any skill card!
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.user_id}
                onClick={() => setActiveContact({ id: c.user_id, name: c.user_name, avatar: c.user_avatar })}
                className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                  activeContact?.id === c.user_id
                    ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <img
                  src={c.user_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.user_id}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full bg-slate-800 object-cover"
                />
                <div className="overflow-hidden flex-1">
                  <div className="text-xs font-bold truncate">{c.user_name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.last_message}</div>
                </div>
                {c.unread_count > 0 && (
                  <span className="w-4 h-4 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {c.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Right Message Feed */}
        <div className="col-span-7 flex flex-col justify-between bg-slate-900/50">
          {activeContact ? (
            <>
              {/* Active Contact Header */}
              <div className="p-3 bg-slate-950/60 border-b border-white/10 flex items-center justify-between text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <img
                    src={activeContact.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeContact.id}`}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full bg-slate-800"
                  />
                  <span>{activeContact.name}</span>
                </div>
                <button onClick={() => loadMessages(activeContact.id)} className="p-1 hover:text-emerald-400">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    Start your conversation with {activeContact.name}! 👋
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === currentUser.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-900/30'
                              : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 px-1">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-2.5 bg-slate-950/80 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="glass-button p-2 text-xs rounded-xl"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-600" />
              <p className="text-xs font-semibold">Select a contact from the left list or click 'Chat' on a user's skill post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
