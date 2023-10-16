import { User } from './user';

export interface Match {
    opponent: User;
    dateTime: string | null;
    myScore: number;
    opponentScore: number;
}
