import { IsNotEmpty, IsOptional } from 'class-validator';

export class MonitorMethodDTO {
  @IsNotEmpty()
  monLocId: string;

  @IsNotEmpty()
  parameterCode: string;

  @IsOptional()
  subDataCode: string;

  @IsOptional()
  bypassApproachCode: string;

  @IsNotEmpty()
  methodCode: string;

  @IsNotEmpty()
  beginDate: Date;

  @IsNotEmpty()
  beginHour: number;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  endHour: number;

  @IsOptional()
  userId: string;

  @IsOptional()
  addDate: Date;

  @IsOptional()
  updateDate: Date;

  active: boolean;
}
