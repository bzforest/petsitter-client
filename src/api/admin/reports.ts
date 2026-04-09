import apiClient from '@/api/axios'

export type ReportStatus = 'NEW_REPORT' | 'PENDING' | 'RESOLVED' | 'CANCELLED'

export interface Report {
  id: number
  bookingId: number
  reporterId: number
  reporterName: string | null
  reportedSitterId: number
  reportedSitterName: string | null
  issue: string
  description: string | null
  status: ReportStatus
  createdAt: string
}

export interface ReportPage {
  content: Report[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export async function getAdminReports(params: {
  page?: number
  size?: number
  status?: string
} = {}): Promise<ReportPage> {
  const { data } = await apiClient.get<ReportPage>('/api/reports/admin', { params })
  return data
}

export async function getAdminReportById(id: number): Promise<Report> {
  const { data } = await apiClient.get<Report>(`/api/reports/admin/${id}`)
  return data
}

export async function updateReportStatus(id: number, status: string): Promise<Report> {
  const { data } = await apiClient.patch<Report>(`/api/reports/admin/${id}/status`, { status })
  return data
}
