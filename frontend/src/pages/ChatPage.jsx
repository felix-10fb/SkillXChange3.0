import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, RefreshCw, User, Sparkles } from 'lucide-react';
import { api } from '../api/client';

export default function ChatPage({ currentUser, onOpenAuth, activeContact, setActiveContact }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser]);

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
      if (!activeContact && convs.length > 0) {
        setActiveContact({ id: convs[0].user_id, name: convs[0].user_name, avatar: convs[0].user_avatar });
      }
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

  if (!currentUser) {
    return (
      <div className="mx-4 my-12 p-12 glass-panel text-center max-w-md mx-auto space-y-4">
        <MessageSquare className="w-16 h-16 text-[#DE5E44] mx-auto" />
        <h2 className="text-2xl font-black text-[#2C1F56] dark:text-white">Community Chat Workspace</h2>
        <p className="text-xs text-slate-500">Sign in to connect with skill hosts and learners in direct messaging!</p>
        <button onClick={onOpenAuth} className="btn-primary text-xs py-2.5 px-6 inline-flex">
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 my-6 glass-panel border border-[#DE5E44]/20 overflow-hidden h-[680px] flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 bg-slate-900/5 dark:bg-slate-900/60 border-b border-slate-900/10 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DE5E44]/15 flex items-center justify-center text-[#DE5E44]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#2C1F56] dark:text-white font-['Outfit']">Direct Mentorship Messaging</h2>
            <p className="text-xs text-slate-500">Real-time conversations with SkillXChange members</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Contacts List */}
        <div className="col-span-4 border-r border-slate-900/10 dark:border-white/10 bg-slate-900/5 dark:bg-slate-950/40 p-3 overflow-y-auto space-y-1">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
            Active Contacts ({conversations.length})
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-12 px-2 text-slate-400 text-xs">
              No conversations yet. Visit the Explore page to message a tutor!
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.user_id}
                onClick={() => setActiveContact({ id: c.user_id, name: c.user_name, avatar: c.user_avatar })}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                  activeContact?.id === c.user_id
                    ? 'bg-[#2C1F56] text-white shadow-md'
                    : 'hover:bg-slate-900/10 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                <img
                  src={c.user_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.user_id}`}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full bg-slate-800 object-cover"
                />
                <div className="overflow-hidden flex-1">
                  <div className="text-xs font-bold truncate">{c.user_name}</div>
                  <div className="text-[11px] opacity-80 truncate">{c.last_message}</div>
                </div>
                {c.unread_count > 0 && (
                  <span className="w-5 h-5 bg-[#DE5E44] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {c.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Right Messages Workspace */}
        <div className="col-span-8 flex flex-col justify-between bg-white/40 dark:bg-slate-900/40">
          {activeContact ? (
            <>
              {/* Header */}
              <div className="p-3 bg-slate-900/5 dark:bg-slate-950/60 border-b border-slate-900/10 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <img
                    src={activeContact.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeContact.id}`}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full bg-slate-800"
                  />
                  <span>{activeContact.name}</span>
                </div>
                <button onClick={() => loadMessages(activeContact.id)} className="p-1 hover:text-[#DE5E44]">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 text-xs">
                    Start your conversation with {activeContact.name}! 👋
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === currentUser.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#DE5E44] text-white rounded-br-none shadow-md'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-900/10 dark:border-slate-700 shadow-sm'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className="p-3 bg-slate-900/5 dark:bg-slate-950/80 border-t border-slate-900/10 dark:border-white/10 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeContact.name}...`}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5E44]"
                />
                <button type="submit" className="btn-primary text-xs py-2 px-4">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-12 h-12 opacity-40 text-[#DE5E44]" />
              <p className="text-xs font-bold">Select a contact from the left menu or click 'Chat' on any skill card!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
