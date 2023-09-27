import { DatePipe } from "@angular/common";

export interface Post {
    user: string;
    text: string;
    dateTime: string | null;
}