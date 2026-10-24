import axios from "axios";

const backendUrl = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
);
const tokenKey = ["to", "ken"].join("");

const authConfig = () => {
  const token = localStorage.getItem(tokenKey);

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

export const fetchContests = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/contests`);
    return response.data.contests || [];
  } catch (error) {
    console.error("Failed to fetch contests. Using fallback data.", error);
    return [];
  }
};

export const addParticipant = async (contestId, userId) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/contests/${contestId}/addParticipants`,
      { userId },
      authConfig(),
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add participant.", error);
    throw error;
  }
};

export const removeParticipant = async (contestId, userId) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/contests/${contestId}/removeParticipants`,
      { userId },
      authConfig(),
    );
    return response.data;
  } catch (error) {
    console.error("Failed to remove participant.", error);
    throw error;
  }
};

export const addContestToUserProfile = async (contestId, userId) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/contests/${contestId}/addContestToUserProfile`,
      { userId },
      authConfig(),
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add contest to user profile.", error);
    throw error;
  }
};

export const removeContestFromUserProfile = async (contestId, userId) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/contests/${contestId}/removeContestFromUserProfile`,
      { userId },
      authConfig(),
    );
    return response.data;
  } catch (error) {
    console.error("Failed to remove contest from user profile.", error);
    throw error;
  }
};

export const fetchContestById = async (contestId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/contests/${contestId}`);
    return response.data.contest || null;
  } catch (error) {
    console.error(`Failed to fetch contest ${contestId}.`, error);
    return null;
  }
};

export const fetchContestProgress = async (contestId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/contests/${contestId}/progress`,
      authConfig(),
    );
    return response.data.progress || null;
  } catch (error) {
    console.error(`Failed to fetch progress for contest ${contestId}.`, error);
    return null;
  }
};

export const fetchContestProblemById = async (contestId, problemId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/contests/${contestId}/problem/${problemId}`,
    );
    return response.data || null;
  } catch (error) {
    console.error(`Failed to fetch contest problem ${problemId}.`, error);
    return null;
  }
};

export const fetchContestLeaderboard = async (contestId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/contests/${contestId}/leaderboard`,
      authConfig(),
    );

    console.log(`Fetched leaderboard for contest ${contestId}:`, response.data);

    return {
      leaderboard: response.data.leaderboard || [],
      userRank: response.data.userRank || null,
    };
  } catch (error) {
    console.error(
      `Failed to fetch leaderboard for contest ${contestId}.`,
      error,
    );
    return {
      leaderboard: [],
      userRank: null,
    };
  }
};

export const fetchContestSubmissions = async (contestId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/contests/${contestId}/submissions`,
      authConfig(),
    );
    return response.data.submissions || [];
  } catch (error) {
    console.error(`Failed to fetch submissions for contest ${contestId}.`, error);
    return [];
  }
};

export const submitContestProblem = async (
  contestId,
  problemId,
  code,
  language,
  status,
  runtime,
  memory,
  passedTestCases,
  totalTestCases,
) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/contests/${contestId}/${problemId}/submit`,
      {
        code,
        language,
        status,
        runtime,
        memory,
        passedTestCases,
        totalTestCases,
      },
      authConfig(),
    );

    return response;
  } catch (error) {
    console.error(
      "Failed to submit contest problem.",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};
