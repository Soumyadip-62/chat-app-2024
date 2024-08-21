import { Timestamp } from "firebase/firestore";

export type Message = {
  senderId:any;
  text: string;
  timeStamp: Timestamp;
};
