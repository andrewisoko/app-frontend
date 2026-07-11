import { apiClient } from './apis/api'

export interface NotificationUser {
    id: string;
    from:string
    message: string;
    read:boolean
    created_at: Date;
}

export const notificationsService = {


  async getUserNotifications(userId:string):Promise<NotificationUser[]>{
    return await apiClient.get(`/notification/${userId}`)
  },
  async getNotification(id:string):Promise<NotificationUser>{
    return await apiClient.get(`/notification/${id}`)
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
