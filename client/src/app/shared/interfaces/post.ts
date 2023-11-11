export interface Post {
    senderId?: number;
	receiverId?: number;
    senderName?: string;
    senderColor?: string;
    senderAvatar: string;
    message: string;
    channel?: string;
    timestamp: string;
	gameInvite?: boolean;
}