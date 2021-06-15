import { IsNotEmpty } from 'class-validator';

export class UserCheckOutDTO {
  @IsNotEmpty()
  user: string;
}
