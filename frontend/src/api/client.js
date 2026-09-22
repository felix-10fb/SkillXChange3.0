const API_BASE = "/api";

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

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "An unexpected error occurred.");
  }

  return data;
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
