import apiClient from "../api/axios";

const PROFILE_CACHE_TTL_MS = 60_000;
let profileCache: any | null = null;
let profileCacheAt = 0;

function rememberProfile(data: any) {
  profileCache = data;
  profileCacheAt = Date.now();
}

function hasFreshCache() {
  return !!profileCache && Date.now() - profileCacheAt < PROFILE_CACHE_TTL_MS;
}

export const getProfile = async () => {
  const res = await apiClient.get("/api/sitter-profiles/me");
  rememberProfile(res.data);
  return res;
};

export const updateProfile = async (id: number, data: any) => {
  return await apiClient.put(`/api/sitter-profiles/${id}`, data);
};

export const requestApproval = async (id: number) => {
  return await apiClient.patch(`/api/sitter-profiles/${id}/request-approval`);
};

export const getProfileCache = () => profileCache;

export const getProfileWithCache = async (force = false) => {
  if (!force && hasFreshCache()) {
    return { data: profileCache, fromCache: true as const };
  }
  const res = await getProfile();
  return { data: res.data, fromCache: false as const };
};