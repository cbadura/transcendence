export interface User {
    id: number;
    name: string;
    status: string;
    level: number; //should be float with 2 digits after comma e.g 2.03
    matches: number;
    wins: number;
    color: string;
    avatar: string;
    avatarLocalUrl?: string;
    friends: User[];
}