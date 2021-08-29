import { IsOptional } from 'class-validator';

export class MonitorMethodBaseDTO {
  parameterCode: string;

  monitoringMethodCode: string;

  @IsOptional()
  substituteDataCode: string;

  @IsOptional()
  bypassApproachCode: string;

  beginDate: Date;

  beginHour: number;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  endHour: number;
}
