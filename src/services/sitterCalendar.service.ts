import apiClient from "../api/axios";

export interface SitterCalendarItemResponse {
  bookingId: number;
  ownerId: number;
  ownerName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: "PENDING" | "PAID" | "CONFIRMED" | "IN_SERVICE" | "COMPLETED" | "CANCELLED";
}

export const getMySitterCalendar = async (startDate: string, endDate: string) => {
  return await apiClient.get<SitterCalendarItemResponse[]>(
    `/api/sitter-calendar/me?startDate=${startDate}&endDate=${endDate}`
  );
};
