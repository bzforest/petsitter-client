import apiClient from "../api/axios";

export interface PayoutTransaction {
  id: number;          // Transaction No. (booking id)
  date: string;        // วันที่ formatted
  fromUserId: number;  // user_id ของผู้จอง
  fromName: string;    // ชื่อผู้จอง
  amount: number;      // total_price (ตัวเลข)
}

/**
 * ดึง payout transactions ของ sitter ที่ login อยู่
 */
export const getMyPayouts = async (): Promise<PayoutTransaction[]> => {
  const res = await apiClient.get<PayoutTransaction[]>("/api/payouts/me");
  return res.data;
};
