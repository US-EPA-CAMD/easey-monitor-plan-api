import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMatsMethodDTO {
  @IsNotEmpty()
  beginDate: Date;

  @IsNotEmpty()
  beginHour: number;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  endHour: number;
}
