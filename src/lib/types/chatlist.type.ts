export enum ReadReceiptStatus {
  UNREAD,
  READ,
  DELIVERED,
  SEEN,
}

export type ChatListProps = {
  userId?: string;
  userImg?: string;
  userName?:string; 
  lastMessage?: string;
  online?: boolean;
  time?: string;
  readReciept?: ReadReceiptStatus;
};

export interface Message {
  message: string;
  senderId: number;
  time: string;
  date: string;
}