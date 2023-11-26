import { User } from './user';

// export interface Match {
//     opponent: User;
//     dateTime: string | null;
//     myScore: number;
//     opponentScore: number;
//     myResult?: boolean;
// }

export interface MatchUser{
    id: number;
    user: User;
    score: number;
    outcome: boolean;
}

export interface Match {
    id: number;
    timestamp: Date;
    reason: 'score' | 'disconnect';
    matchType: 'default' | 'special';
    matchUsers: MatchUser[];
}

