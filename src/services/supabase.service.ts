import apiClient from "../api/axios";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  formData.append("bucket", "profile-images");

  const res = await apiClient.post("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url as string;
};