import apiClient from '@/api/axios'

export type SitterStatus = 'WAITING_FOR_APPROVE' | 'APPROVED' | 'REJECTED'

export interface SitterProfile {
  id: number
  userId: number
  email: string
  bio: string | null
  pricePerHour: number | null
  experience: number | null
  tradeName: string | null
  petTypes: string | null
  services: string | null
  placeDescription: string | null
  phone: string | null
  idNumber: string | null
  servicesDescription: string | null
  dateOfBirth: string | null
  status: SitterStatus
  isApproved: boolean
  ratingAvg: number | null
  rejectReason: string | null
  latitude: number | null
  longitude: number | null
  gallery: string[]
  addressId: number | null
  addressLine: string | null
  district: string | null
  subDistrict: string | null
  province: string | null
  postalCode: string | null
}

// response for getting sitter profiles with pagination
export interface SitterProfilePage {
  content: SitterProfile[] // list of sitter profiles
  totalElements: number // total number of sitter profiles
  totalPages: number // total number of pages
  size: number // size of the page
  number: number // number of the page
}

// parameters for getting sitter profiles with pagination
export interface GetSitterProfilesParams {
  page?: number
  size?: number
  sortBy?: string
  direction?: 'asc' | 'desc'
  minPrice?: number
  maxPrice?: number
}

export async function getSitterProfiles(
  params: GetSitterProfilesParams = {},
): Promise<SitterProfilePage> {
  const { data } = await apiClient.get<SitterProfilePage>('/api/sitter-profiles', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sortBy: params.sortBy ?? 'id',
      direction: params.direction ?? 'asc',
      ...(params.minPrice !== undefined && { minPrice: params.minPrice }),
      ...(params.maxPrice !== undefined && { maxPrice: params.maxPrice }),
    },
  })
  return data
}
