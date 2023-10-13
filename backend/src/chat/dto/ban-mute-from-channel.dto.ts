import { InviteToChannelDto } from './invite-to-channel.dto';
import { IsNumber } from 'class-validator';

/**
 * Dto for banning/muting a user from a channel.
 * @property {number} userId - The ID of user perfrom ban/mute action.
 * @property {string} channel - The name of the channel.
 * @property {number} invitedUserId - The ID of user being banned/muted.
 * @property {number} expirationTimestamp - The expiration timestamp of ban/mute. 
 */
export class BanMuteFromChannelDto extends InviteToChannelDto {
  @IsNumber()
  expirationTimestamp: number;
}
