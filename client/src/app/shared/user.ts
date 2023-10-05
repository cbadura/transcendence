export interface User {
    id: number;
    userName: string;
    status: string;
    wins: number;
    losses: number;
    color: string;
    avatar: string;
    friends: User[];
}