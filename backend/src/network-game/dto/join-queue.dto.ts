import { IsString } from "class-validator";

/**
 * Dto for banning/muting a user from a channel.
 * @property {string} queue - The Queue which the user should join.
 */
export class JoinQueueDto {
    @IsString()
    gameType: 'default' | 'special';
}