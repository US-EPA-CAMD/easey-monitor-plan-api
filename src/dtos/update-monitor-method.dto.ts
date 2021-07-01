import { IsOptional } from 'class-validator';

export class UpdateMonitorMethodDTO {
  methodCode: string;
  parameterCode: string;

  @IsOptional()
  subDataCode: string;

  @IsOptional()
  bypassApproachCode: string;

  beginDate: Date;
  beginHour: number;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  endHour: number;
}
