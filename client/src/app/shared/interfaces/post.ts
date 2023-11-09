export interface Post {
    senderId?: number;
    senderName?: string;
    senderColor?: string;
    senderAvatar: string;
    message: string;
    channel?: string;
    timestamp: string;
	gameInvite?: boolean;
}