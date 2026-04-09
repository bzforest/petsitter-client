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
  number: number;
  totalPages: number;
  totalElements: number;
}

export const getSitterBookings = async (page = 0, size = 10) => {
  const { data } = await apiClient.get<ApiPage<BookingResponse>>(`/api/bookings/sitter/me?page=${page}&size=${size}`);
  return {
    content: data.content ?? [],
    number: data.number ?? page,
    totalPages: data.totalPages ?? 1,
    totalElements: data.totalElements ?? (data.content?.length ?? 0),
  };
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
