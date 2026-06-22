import { apiClient } from './api'

export interface ContractNotification {
  id: string
  contractId: string
  senderId: string
  receiverId: string
  receiverName: string
  action: 'accepted' | 'declined'
  timestamp: string
  read: boolean
}

export const notificationsService = {
  // Fetch contract notifications for the current user (as sender)
  async getContractNotifications(userId: string): Promise<ContractNotification[]> {
    try {
      // This endpoint would ideally be on the backend
      // For now, we'll fetch contracts and check for status changes
      const response = await apiClient.get<ContractNotification[]>(`/notifications/contracts/${userId}`)
      return response
    } catch (error) {
      // Fallback: return empty array if endpoint doesn't exist yet
      console.log('Notifications endpoint not available yet:', error)
      return []
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  },

  // Clear all notifications
  async clearAll(userId: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/contracts/${userId}`)
    } catch (error) {
      console.error('Failed to clear notifications:', error)
    }
  },
}
