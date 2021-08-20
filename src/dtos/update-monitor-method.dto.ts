import { IsOptional } from 'class-validator';

export class UpdateMonitorMethodDTO {
  monitoringMethodCode: string;
  parameterCode: string;

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
