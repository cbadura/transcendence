import { DatePipe } from "@angular/common";
import { User } from "./user";

export interface Post {
    user: User;
    text: string;
    room?: string;
    color?: string;
    dateTime: string | null;
}