import { User } from "./IUser";

export interface Post {
  user: User;
  text: string;
  room?: string;
  color?: string;
  dateTime: string | null;
}