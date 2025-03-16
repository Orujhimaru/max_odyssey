const API_URL = "http://localhost:8080";

export const api = {
  // Get the token from localStorage
  getToken: () => localStorage.getItem("token"),

  // Make authenticated requests
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      console.log(`Making ${options.method || "GET"} request to ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, config);

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      return response;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Login
  login: async (username) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },

  // Get questions
  getQuestions: async () => {
    const response = await api.request("/questions");
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return response.json();
  },

  // Get a single question by ID
  getQuestion: async (id) => {
    const response = await api.request(`/questions/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch question: ${response.status}`);
    }
    return response.json();
  },

  // Get bookmarked questions
  getBookmarkedQuestions: async () => {
    const response = await api.request("/bookmarks");
    if (!response.ok) {
      throw new Error("Failed to fetch bookmarked questions");
    }
    return response.json();
  },

  // Toggle bookmark
  toggleBookmark: async (questionId) => {
    const response = await api.request("/bookmark", {
      method: "POST",
      body: JSON.stringify({ questionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle bookmark");
    }

    return response.json();
  },
};
