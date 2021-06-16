import { IsNotEmpty } from 'class-validator';

export class UserCheckOutDTO {
  @IsNotEmpty()
  username: string;
}
