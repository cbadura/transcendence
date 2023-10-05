import { DatePipe } from "@angular/common";
import { User } from "./user";

export interface Post {
    user: User;
    text: string;
    dateTime: string | null;
}