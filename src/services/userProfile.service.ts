import apiClient from "@/api/axios";

export interface OwnerProfileResponse {
  id: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  idNumber: string | null;
  dateOfBirth: string | null;
  userId: number | null;
}

export const getOwnerProfileByUserId = async (userId: number) => {
  return await apiClient.get<OwnerProfileResponse>(`/api/user-profiles/user/${userId}`);
};
