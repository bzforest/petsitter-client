import api from "../api/axios";

export const getProfile = async () => {
  return await api.get("/sitters/profile");
};