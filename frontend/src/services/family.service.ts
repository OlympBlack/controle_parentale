import { apiClient } from '@/lib/api-client'
import type { ApiResponse, Family, FamilyMember, PendingInvitation, UserRole } from '@/types'

export const familyService = {
  async list(): Promise<Family[]> {
    const { data } = await apiClient.get<ApiResponse<Family[]>>('/families', {
      params: { per_page: 100 },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  async create(name: string, plan: 'free' | 'premium' = 'free'): Promise<Family> {
    const { data } = await apiClient.post<ApiResponse<Family>>('/families', { name, plan })
    return data.data
  },

  async listMembers(familyId: number): Promise<FamilyMember[]> {
    const { data } = await apiClient.get<ApiResponse<FamilyMember[]>>(
      `/families/${familyId}/members`
    )
    return Array.isArray(data.data) ? data.data : []
  },

  async addMember(familyId: number, email: string, role: UserRole): Promise<FamilyMember> {
    const { data } = await apiClient.post<ApiResponse<FamilyMember>>(
      `/families/${familyId}/members`,
      { email: email.toLowerCase().trim(), role }
    )
    return data.data
  },

  async updateMemberRole(
    familyId: number,
    userId: number,
    role: UserRole
  ): Promise<FamilyMember> {
    const { data } = await apiClient.patch<ApiResponse<FamilyMember>>(
      `/families/${familyId}/members/${userId}`,
      { role }
    )
    return data.data
  },

  async removeMember(familyId: number, userId: number): Promise<void> {
    await apiClient.delete(`/families/${familyId}/members/${userId}`)
  },

  async listInvitations(familyId: number): Promise<PendingInvitation[]> {
    const { data } = await apiClient.get<ApiResponse<PendingInvitation[]>>(
      `/families/${familyId}/invitations`
    )
    return Array.isArray(data.data) ? data.data : []
  },

  async cancelInvitation(familyId: number, invitationId: number): Promise<void> {
    await apiClient.delete(`/families/${familyId}/invitations/${invitationId}`)
  },

  async getInvitation(token: string) {
    const { data } = await apiClient.get<ApiResponse<{
      token: string
      family_name: string
      invited_by: string
      role: string
      role_label: string
      expires_at: string
      email: string
    }>>(`/invitations/${token}`)
    return data.data
  },

  async acceptInvitation(token: string): Promise<{ family_id: number; family_name: string; role: string }> {
    const { data } = await apiClient.post<ApiResponse<{ family_id: number; family_name: string; role: string }>>(
      `/invitations/${token}/accept`
    )
    return data.data
  },
}
