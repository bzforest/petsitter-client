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

const SITTER_BOOKINGS_LIST_TTL_MS = 60_000;
const sitterBookingsListCache = new Map<
  string,
  {
    content: BookingResponse[];
    number: number;
    totalPages: number;
    totalElements: number;
    cachedAt: number;
  }
>();

function sitterBookingsListKey(page: number, size: number) {
  return `${page}_${size}`;
}

export type SitterBookingsListSnapshot = {
  content: BookingResponse[];
  number: number;
  totalPages: number;
  totalElements: number;
  cachedAt: number;
};

export function getSitterBookingsListSnapshot(page: number, size: number): SitterBookingsListSnapshot | null {
  return sitterBookingsListCache.get(sitterBookingsListKey(page, size)) ?? null;
}

export function invalidateSitterBookingsListCache() {
  sitterBookingsListCache.clear();
}

/** Cached page fetch; use forceNetwork after a mutation or to bypass TTL. */
export async function getSitterBookingsPageWithCache(page = 0, size = 10, forceNetwork = false) {
  const key = sitterBookingsListKey(page, size);
  const hit = sitterBookingsListCache.get(key);
  if (!forceNetwork && hit && Date.now() - hit.cachedAt < SITTER_BOOKINGS_LIST_TTL_MS) {
    return { ...hit, fromCache: true as const };
  }
  const res = await getSitterBookings(page, size);
  const payload = {
    content: res.content,
    number: res.number,
    totalPages: res.totalPages,
    totalElements: res.totalElements,
    cachedAt: Date.now(),
  };
  sitterBookingsListCache.set(key, payload);
  return { ...payload, fromCache: false as const };
}

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
