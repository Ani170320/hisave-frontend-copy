import apiClient from "./apiClient";

export const loginAI = async (payload: any) => {
  const response = await apiClient.post("/login", payload);
  localStorage.setItem("authToken", response.data.token);
  return response.data;
};