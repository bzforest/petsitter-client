import api from "../api/axios";

export const getProfile = async () => {
  return await api.get("/sitter-profiles/me");
};

export const updateProfile = async (id: number, data: any) => {
  return await api.put(`/sitter-profiles/${id}`, data);
};

export const requestApproval = async (id: number) => {
  return await api.patch(`/sitter-profiles/${id}/request-approval`);
};