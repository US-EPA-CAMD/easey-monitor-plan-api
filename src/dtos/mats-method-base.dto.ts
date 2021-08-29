import { IsOptional } from 'class-validator';

export class MatsMethodBaseDTO {
  supplementalMATSParameterCode: string;

  supplementalMATSMonitoringMethodCode: string;

  beginDate: Date;

  beginHour: number;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  endHour: number;
}
