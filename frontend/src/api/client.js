const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = isLocal ? "http://127.0.0.1:8000/api" : "/api";

export const getToken = () => localStorage.getItem("skillxchange_token");

export const setToken = (token) => {
  if (token) localStorage.setItem("skillxchange_token", token);
  else localStorage.removeItem("skillxchange_token");
};

export const getUser = () => {
  const u = localStorage.getItem("skillxchange_user");
  return u ? JSON.parse(u) : null;
};

export const setUser = (user) => {
  if (user) localStorage.setItem("skillxchange_user", JSON.stringify(user));
  else localStorage.removeItem("skillxchange_user");
};

// Fallback Mock Data for preview if backend is offline
const MOCK_SKILLS = [
  {
    id: 1,
    title: "Full-Stack React & Next.js Architecture",
    description: "Learn how to build high-performance web applications with React, TailwindCSS, and modern state management.",
    category: "Technology",
    skill_type: "offer",
    coin_price: 30,
    level: "Advanced",
    owner_id: 2,
    owner_name: "Alex Rivera",
    owner_avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AlexR",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Figma Design Systems & Modern UX/UI",
    description: "Master visual component libraries, glassmorphism UI tokens, and dynamic micro-interactions.",
    category: "Design",
    skill_type: "offer",
    coin_price: 25,
    level: "Intermediate",
    owner_id: 3,
    owner_name: "Sarah Chen",
    owner_avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SarahC",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Spanish Conversational Mastery",
    description: "Fluent native Spanish sessions covering daily business and travel conversations.",
    category: "Languages",
    skill_type: "offer",
    coin_price: 20,
    level: "Beginner",
    owner_id: 4,
    owner_name: "David Miller",
    owner_avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DavidM",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Acoustic Guitar Fingerpicking Basics",
    description: "Learn chords, melody lines, and rhythm techniques for acoustic guitar.",
    category: "Music",
    skill_type: "offer",
    coin_price: 35,
    level: "Beginner",
    owner_id: 5,
    owner_name: "Maya Lin",
    owner_avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=MayaL",
    created_at: new Date().toISOString()
  }
];

const MOCK_REWARDS = [
  {
    id: 1,
    title: "🔥 7-Day Streak Shield",
    description: "Protects your daily login streak count if you miss 1 day.",
    coin_price: 50,
    icon: "🛡️",
    category: "Boosters",
    code: "SHIELD-7DAY-STREAK"
  },
  {
    id: 2,
    title: "👑 Gold Master Mentor Badge",
    description: "Exclusive shiny profile badge highlighting you as a top verified teacher.",
    coin_price: 150,
    icon: "👑",
    category: "Badges",
    code: "BADGE-GOLD-MENTOR"
  },
  {
    id: 3,
    title: "🚀 Featured Skill Listing Boost",
    description: "Pin your offered skill post to the top of the SkillXChange home page for 14 days.",
    coin_price: 100,
    icon: "🚀",
    category: "Promotions",
    code: "BOOST-FEATURED-14D"
  },
  {
    id: 4,
    title: "🎁 1-on-1 VIP Mentorship Voucher",
    description: "Unlocks a priority 60-minute direct session pass with any Pro tutor.",
    coin_price: 200,
    icon: "🎓",
    category: "Vouchers",
    code: "VOUCHER-VIP-PASS"
  }
];

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text || "Invalid response" };
    }

    if (!response.ok) {
      throw new Error(data.detail || `Server returned ${response.status}`);
    }

    return data;
  } catch (err) {
    console.warn(`[API Client Warning] Backend endpoint ${endpoint} fallback:`, err.message);
    
    // Provide fallback mock data for endpoints if backend is offline
    if (endpoint.startsWith("/skills")) return MOCK_SKILLS;
    if (endpoint.startsWith("/rewards")) return MOCK_REWARDS;
    if (endpoint.startsWith("/exchanges") || endpoint.startsWith("/chat")) return [];
    if (endpoint.startsWith("/admin/stats")) {
      return { total_users: 5, total_skills: 5, total_exchanges: 12, total_chat_messages: 24, total_coins_circulating: 1450 };
    }
    
    throw err;
  }
}

export const api = {
  // Auth
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getMe: () => request("/auth/me"),

  // Users & Streaks
  getProfile: () => request("/users/profile"),
  claimDailyCheckin: () => request("/users/checkin", { method: "POST" }),
  getTransactions: () => request("/users/transactions"),

  // Skills
  getSkills: (category = "All", skillType = "All", search = "") => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (skillType && skillType !== "All") params.append("skill_type", skillType);
    if (search) params.append("search", search);
    return request(`/skills?${params.toString()}`);
  },
  createSkill: (skillData) => request("/skills", { method: "POST", body: JSON.stringify(skillData) }),
  deleteSkill: (skillId) => request(`/skills/${skillId}`, { method: "DELETE" }),

  // Exchanges
  getExchanges: () => request("/exchanges"),
  requestExchange: (exchangeData) => request("/exchanges", { method: "POST", body: JSON.stringify(exchangeData) }),
  updateExchangeStatus: (exchangeId, status) => request(`/exchanges/${exchangeId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Chat
  getConversations: () => request("/chat/conversations"),
  getMessages: (otherUserId) => request(`/chat/messages/${otherUserId}`),
  sendMessage: (receiverId, content) => request("/chat/send", { method: "POST", body: JSON.stringify({ receiver_id: receiverId, content }) }),

  // Rewards
  getRewards: () => request("/rewards"),
  redeemReward: (rewardId) => request(`/rewards/redeem/${rewardId}`, { method: "POST" }),

  // Admin
  getAdminStats: () => request("/admin/stats"),
  getAdminUsers: () => request("/admin/users"),
  grantCoins: (userId, amount, reason) => request(`/admin/users/${userId}/grant-coins`, { method: "POST", body: JSON.stringify({ amount, reason }) }),
  toggleBan: (userId) => request(`/admin/users/${userId}/toggle-ban`, { method: "POST" }),
  toggleRole: (userId) => request(`/admin/users/${userId}/toggle-role`, { method: "POST" }),
};
