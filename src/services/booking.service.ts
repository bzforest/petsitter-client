import apiClient from "../api/axios";

export type BookingStatusApi = "PENDING" | "PAID" | "CONFIRMED" | "IN_SERVICE" | "COMPLETED" | "CANCELLED";

export interface BookingResponse {
  id: number;
  userId: number;
  ownerName: string | null;
  sitterId: number;
  sitterName: string;
  sitterProfileImage: string | null;
  createdAt: string;
  petNames: string[];
  petIds: number[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  pricePerHour: number;
  noteToSitter: string | null;
  paymentMethod: string;
  totalPrice: number;
  status: BookingStatusApi;
}
interface ApiPage<T> {
  content: T[];
}

export const getSitterBookings = async () => {
  const { data } = await apiClient.get<ApiPage<BookingResponse>>("/api/bookings/sitter/me?page=0&size=100");
  return data.content ?? [];
};

export const getBookingsBySitterId = async (sitterUserId: number) => {
  const { data } = await apiClient.get<ApiPage<BookingResponse>>(`/api/bookings/admin/sitter/${sitterUserId}?page=0&size=100`);
  return data.content ?? [];
};

export const getBookingById = async (id: number) => {
  return await apiClient.get<BookingResponse>(`/api/bookings/${id}`);
};

export const confirmBookingBySitter = async (id: number) => {
  return await apiClient.patch<BookingResponse>(`/api/bookings/${id}/confirm`);
};

export const completeBookingBySitter = async (id: number) => {
  return await apiClient.patch<BookingResponse>(`/api/bookings/${id}/complete`);
};

export const startInServiceBySitter = async (id: number) => {
  return await apiClient.patch<BookingResponse>(`/api/bookings/${id}/start-service`);
};

export const rejectBookingBySitter = async (id: number) => {
  return await apiClient.patch<BookingResponse>(`/api/bookings/${id}/decline-by-sitter`);
};
