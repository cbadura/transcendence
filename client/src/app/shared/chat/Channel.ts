import { EChannelMode } from '../macros/EChannelMode';
import { EUserRole } from '../macros/EUserRole';

export interface Channel {
    name: string;
    mode: EChannelMode;
    role: EUserRole;
    isBanned: boolean;
    isMuted: boolean;
    banExpTime?: number;
    muteExpTime?: number;
    usersIds: number[];
	password?: string;
	adminIds: number[];
	ownerId: number;
}