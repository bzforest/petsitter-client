import apiClient from "../api/axios";

export const getProfile = async () => {
  return await apiClient.get("/api/sitter-profiles/me");
};

export const updateProfile = async (id: number, data: any) => {
  return await apiClient.put(`/api/sitter-profiles/${id}`, data);
};

export const requestApproval = async (id: number) => {
  return await apiClient.patch(`/api/sitter-profiles/${id}/request-approval`);
};