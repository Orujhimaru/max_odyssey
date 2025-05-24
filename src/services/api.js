const API_URL = "http://3.121.235.56:8080";

export const api = {
  // No longer need to get token from localStorage
  // getToken: () => localStorage.getItem("token"),

  // Make requests without authentication
  request: async (endpoint, options = {}) => {
    // No longer need to get token
    // const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // No longer need to add authorization header
    // if (token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    const config = {
      ...options,
      headers,
    };

    try {
      console.log(`Making ${options.method || "GET"} request to ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, config);

      // Don't redirect to login page when authentication fails
      // Since login has been removed, we'll just return the response
      // if (response.status === 401) {
      //   localStorage.removeItem("token");
      //   window.location.href = "/login";
      // }

      return response;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Login - no longer needed but keeping for reference
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
  // getBookmarkedQuestions: async (sortDir = "asc", page = 1, pageSize = 20) => {
  //   // Use getFilteredQuestions with is_bookmarked flag
  //   console.log("Using getFilteredQuestions with is_bookmarked flag");
  //   return api.getFilteredQuestions({
  //     sort_dir: sortDir,
  //     page: page,
  //     page_size: pageSize,
  //     is_bookmarked: 1,
  //     subject: 1, // Default to subject 1 since it's required
  //   });
  // },

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
    console.log("queryParams", queryParams);
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

    if (filters.is_bluebook) {
      queryParams.append("is_bluebook", filters.is_bluebook);
    }

    if (filters.hide_solved) {
      queryParams.append("hide_solved", filters.hide_solved);
    }

    // Add is_bookmarked parameter if present
    if (filters.is_bookmarked) {
      queryParams.append("is_bookmarked", filters.is_bookmarked);
    }

    // Add incorrect parameter if present
    if (filters.incorrect !== undefined) {
      queryParams.append("incorrect", filters.incorrect);
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

      // Debug: Log the full response for inspection
      const responseClone = response.clone();
      const responseText = await responseClone.text();
      // console.log("Full API response:", responseText);

      // Try to parse the response
      let jsonData;
      try {
        jsonData = JSON.parse(responseText);
        console.log("Parsed response data:", jsonData);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
      }

      // Return mock data if unauthorized (since login was removed)
      if (response.status === 401) {
        console.log("Unauthorized request, returning mock data");
        return {
          questions: [],
          total_pages: 1,
          total_questions: 0,
          message: "Using mock data since authentication is disabled",
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to fetch filtered questions: ${response.status} - ${errorText}`
        );
        throw new Error(
          `Failed to fetch questions: ${response.status} - ${errorText}`
        );
      }

      // Get the response data
      let data;
      try {
        // We already parsed the response above, so use that
        data = jsonData;

        // Check for pagination in different response formats
        if (data) {
          // Check for pagination info in different possible structures
          console.log(
            "PAGINATION: Raw API response structure:",
            Object.keys(data)
          );

          // Extract pagination info from either pagination object or directly from response
          const total_pages =
            data.pagination?.total_pages || data.total_pages || 1;
          const total_questions =
            data.pagination?.total_items || data.total_questions || 0;
          const current_page =
            data.pagination?.current_page || data.current_page || 1;

          // Make sure these fields exist in our response
          data.total_pages = total_pages;
          data.total_questions = total_questions;
          data.current_page = current_page;

          console.log("PAGINATION: Extracted pagination data:", {
            total_pages,
            total_questions,
            current_page,
            questions_count: (data.questions || []).length,
          });
        }
      } catch (e) {
        console.error("Error parsing JSON from response:", e);
        data = { questions: [], total_pages: 0, total_questions: 0 };
      }

      // Check if questions array is empty but pagination data exists
      if (
        data &&
        Array.isArray(data.questions) &&
        data.questions.length === 0 &&
        data.total_questions > 0
      ) {
        console.log(
          "Server returned empty questions array but has pagination data. Creating mock questions."
        );

        // Create mock questions based on pagination data
        const mockQuestions = Array.from(
          { length: Math.min(20, data.total_questions) },
          (_, i) => ({
            id: i + 1,
            question_text: `Mock Question ${i + 1} for page ${
              filters.page || 1
            }`,
            subject_id: filters.subject,
            difficulty_level: filters.difficulty || 1,
            topic: "Mock Topic",
            subtopic: "Mock Subtopic",
            solve_rate: Math.floor(Math.random() * 100),
            correct_answer_index: Math.floor(Math.random() * 4),
            is_solved: false,
            incorrect: false,
          })
        );

        data.questions = mockQuestions;
      }

      return data;
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

    // Check if question times are present
    if (userProgressData.user_progress?.question_times) {
      console.log("Question times data included in the update");
      const timeEntries = Object.entries(
        userProgressData.user_progress.question_times
      );
      console.log(`Found ${timeEntries.length} question time entries`);

      // Log a summary of the times
      if (timeEntries.length > 0) {
        const totalTimeMs = timeEntries.reduce(
          (total, [_, time]) => total + time,
          0
        );
        const avgTimeMs = totalTimeMs / timeEntries.length;
        console.log(
          `Total time tracked: ${Math.floor(
            totalTimeMs / 1000
          )}s, Average per question: ${Math.floor(avgTimeMs / 1000)}s`
        );
      }
    }

    // Log modules data
    if (userProgressData.user_progress?.modules) {
      const modules = userProgressData.user_progress.modules;
      const moduleSummary = Object.keys(modules).map((moduleKey) => {
        const questionCount = modules[moduleKey].questions?.length || 0;
        return `${moduleKey}: ${questionCount} questions`;
      });
      console.log("Modules data summary:", moduleSummary);
    }

    // Prepare the request payload according to backend expectations
    const {
      is_finished,
      current_module,
      modules,
      question_times,
      module_time_remaining,
    } = userProgressData;

    const finalPayload = {
      exam_id: parseInt(examId, 10), // Ensure exam_id is an integer
      is_finished: is_finished, // Top-level boolean
      user_progress: {
        // Nested object for progress details
        current_module: current_module,
        modules: modules,
        question_times: question_times,
        module_time_remaining: module_time_remaining,
      },
    };

    // Detailed logging of the full request payload
    console.log("Full request payload to server (corrected structure):");
    console.log(JSON.stringify(finalPayload, null, 2));

    try {
      console.log(`Making API request to /exams/update for exam ${examId}`);
      const response = await api.request("/exams/update", {
        method: "POST",
        body: JSON.stringify(finalPayload),
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
