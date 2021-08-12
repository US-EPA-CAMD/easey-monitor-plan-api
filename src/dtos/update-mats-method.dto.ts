import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMatsMethodDTO {
  @IsNotEmpty()
  matsMethodCode: string;

  @IsNotEmpty()
  matsMethodParameterCode: string;

  @IsNotEmpty()
  beginDate: Date;

  @IsNotEmpty()
  beginHour: number;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  endHour: number;
}
