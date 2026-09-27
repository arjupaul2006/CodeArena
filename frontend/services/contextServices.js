import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

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

export const fetchContestProblemById = async (contestId, problemId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/contests/${contestId}/problem/${problemId}`
    );
    return response.data || null;
  } catch (error) {
    console.error(`Failed to fetch contest problem ${problemId}.`, error);
    return null;
  }
};

