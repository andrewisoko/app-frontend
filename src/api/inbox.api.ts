import apiClient from './axiosInstance';
import { Inbox, RespondInboxDto } from '../types/inbox.types';

export const inboxApi = {
  postInbox: (data: { contractId: string; receiverIds: string[] }) =>
    apiClient.post<Inbox>('/inbox/post-inbox', data),

  respondToInboxContract: (data: RespondInboxDto) =>
    apiClient.post('/inbox/receiver-inbox-contract', data),
};
