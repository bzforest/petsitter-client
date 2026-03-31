import api from "../api/axios";

// GET profile
export const getProfile = async () => {
  return await api.get("/sitters/profile");
};

export const updateProfile = async (id: string, data: any) => {
  return await api.put(`/sitters/${id}`, data);
};

export const requestApproval = async (id: string) => {
  return await api.patch(`/sitters/${id}/request-approval`);
};