import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMatsMethodDTO {
  @IsNotEmpty()
  supplementalMATSMonitoringMethodCode: string;

  @IsNotEmpty()
  supplementalMATSParameterCode: string;

  @IsNotEmpty()
  beginDate: Date;

  @IsNotEmpty()
  beginHour: number;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  endHour: number;
}
