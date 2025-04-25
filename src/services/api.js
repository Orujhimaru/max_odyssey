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
    console.log("Filters", filters);
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
  getUserExamResults: async () => {
    console.log("Fetching user exam results");

    try {
      const response = await api.request("/exams");

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to fetch exam results: ${response.status} - ${errorText}`
        );
        throw new Error(`Failed to fetch exam results: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  // Add this new method for batch updating questions
  batchUpdateQuestions: async (questionStates) => {
    console.log("Sending batch update for questions:", questionStates);

    const response = await api.request("/questions/batch-update", {
      method: "POST",
      body: JSON.stringify({ questions: questionStates }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to batch update questions: ${response.status} - ${errorText}`
      );
      throw new Error(`Failed to batch update questions: ${response.status}`);
    }

    return response.json();
  },

  // Generate a new exam
  generateExam: (() => {
    let isGenerating = false;
    let pendingPromise = null;

    return async () => {
      const callId = Math.random().toString(36).substring(2, 10);
      console.log(`API: generateExam called (ID: ${callId})`);

      // If already generating, return the pending promise
      if (isGenerating && pendingPromise) {
        console.log(`API: Returning existing pending promise (ID: ${callId})`);
        return pendingPromise;
      }

      try {
        isGenerating = true;

        // Create the promise
        pendingPromise = (async () => {
          console.log(
            `API: Making POST request to /exams/generate (ID: ${callId})`
          );
          const response = await api.request("/exams/generate", {
            method: "POST",
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `API: Failed to generate exam (ID: ${callId}): ${response.status} - ${errorText}`
            );
            throw new Error(`Failed to generate exam: ${response.status}`);
          }

          const data = await response.json();
          console.log(
            `API: Exam generated successfully (ID: ${callId}), exam ID: ${data.id}`
          );
          return data;
        })();

        // Wait for the promise to resolve
        const result = await pendingPromise;
        return result;
      } catch (error) {
        console.error(`API: Request failed (ID: ${callId}):`, error);
        throw error;
      } finally {
        // Reset the generating flag and pending promise after a short delay
        // This prevents immediate subsequent calls but allows future ones
        setTimeout(() => {
          isGenerating = false;
          pendingPromise = null;
        }, 1000);
      }
    };
  })(),

  // Get exam by ID
  getExamById: async (examId) => {
    console.log(`Fetching exam with ID: ${examId}`);

    try {
      const response = await api.request(`/exams/${examId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to fetch exam: ${response.status} - ${errorText}`
        );
        throw new Error(`Failed to fetch exam: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  // Delete an exam by ID
  removeExamById: async (examId) => {
    console.log(`Removing exam with ID: ${examId}`);

    try {
      const response = await api.request("/exams/remove", {
        method: "POST",
        body: JSON.stringify({ exam_id: examId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to remove exam: ${response.status} - ${errorText}`
        );
        throw new Error(`Failed to remove exam: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  // Update an exam with user answers
  updateExam: async (examId, userProgressData) => {
    // Simple logging of what we're sending
    console.log(`Updating exam ${examId}:`, userProgressData);

    // Check if is_finished flag is present
    if (userProgressData.user_progress?.is_finished !== undefined) {
      console.log(
        `is_finished flag is set to: ${userProgressData.user_progress.is_finished}`
      );
    } else {
      console.log("No is_finished flag found in userProgressData");
    }

    // Prepare the request payload
    const requestPayload = {
      exam_id: examId,
      ...userProgressData,
    };

    try {
      const response = await api.request("/exams/update", {
        method: "POST",
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to update exam: ${response.status} - ${errorText}`
        );
        throw new Error(`Failed to update exam: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Server response to update exam:", responseData);
      return responseData;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },
};
