import apiClient from "../api/axios";

export interface PetResponse {
  id: number;
  name: string;
  type: string;
  breed: string;
  sex: string;
  age: number;
  weight: number;
  aboutPet: string;
  imageUrl: string;
  userId: number;
}

export const getPetsByUserId = async (userId: number) => {
  return await apiClient.get<PetResponse[]>(`/api/pets/user/${userId}`);
};
