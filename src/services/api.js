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
  getBookmarkedQuestions: async (sortDir = "asc", page = 1, pageSize = 20) => {
    // Build query parameters properly
    const queryParams = new URLSearchParams();

    // Add sort direction parameter
    queryParams.append("sort_dir", sortDir);

    // Add pagination parameters
    queryParams.append("page", page);
    queryParams.append("page_size", pageSize);

    // Create the URL with query parameters
    const url = `/bookmarks?${queryParams.toString()}`;
    console.log("Making bookmarked questions request to:", url);

    // Make the request using the existing request method
    const response = await api.request(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch bookmarked questions: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Failed to fetch bookmarked questions: ${response.status}`
      );
    }

    return response.json();
  },

  // Toggle bookmark
  toggleBookmark: async (questionId) => {
    console.log(
      `Sending bookmark toggle request for question_id: ${questionId}`
    );

    const response = await api.request("/bookmark", {
      method: "POST",
      body: JSON.stringify({ question_id: questionId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to toggle bookmark: ${response.status} - ${errorText}`
      );
      throw new Error(`Failed to toggle bookmark: ${response.status}`);
    }

    return response.json();
  },

  // Get filtered questions
  getFilteredQuestions: async (filters) => {
    // Prepare query parameters
    const queryParams = new URLSearchParams();

    // Add required subject parameter
    if (filters.subject) {
      queryParams.append("subject", filters.subject);
    } else {
      console.error("Subject is required for filtered questions");
      throw new Error("Subject is required");
    }

    // Add optional parameters
    if (filters.difficulty !== undefined && filters.difficulty !== null) {
      queryParams.append("difficulty", filters.difficulty);
    }

    if (filters.topic) {
      queryParams.append("topic", filters.topic);
    }

    if (filters.subtopic) {
      queryParams.append("subtopic", filters.subtopic);
    }

    if (filters.sort_dir) {
      queryParams.append("sort_dir", filters.sort_dir);
    }

    // Add pagination parameters
    if (filters.page) {
      queryParams.append("page", filters.page);
    }

    if (filters.page_size) {
      queryParams.append("page_size", filters.page_size);
    }

    const url = `/questions/filtered?${queryParams.toString()}`;
    console.log("Making filtered questions request to:", url);

    try {
      const response = await api.request(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to fetch filtered questions: ${response.status} - ${errorText}`
        );
        throw new Error(
          `Failed to fetch questions: ${response.status} - ${errorText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },
};
