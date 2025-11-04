export type Message = {
  id: number;
  contractor_id: number;
  client_name: string;
  subject?: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
};

export type ChatMessage = {
  id: number;
  message_id: number;
  sender: 'contractor' | 'client';
  message_text: string;
  created_at: string;
};