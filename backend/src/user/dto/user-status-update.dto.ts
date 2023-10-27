import { IsEnum, IsNumber } from 'class-validator';
import { EUserStatus } from '../../network-game/interfaces/IGameSocketUser';

export class UserStatusUpdateDto {
  @IsNumber()
  userId: number;

  @IsEnum(EUserStatus)
  status: EUserStatus;
}
