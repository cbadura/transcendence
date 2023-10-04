export interface User {
    id: number;
    userName: string;
    status: string;
    wins: number;
    losses: number;
    color: string;
    avatarUrl: string;
    friends: User[];
}
