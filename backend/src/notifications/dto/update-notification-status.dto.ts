import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateNotificationStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isRead!: boolean;
}
