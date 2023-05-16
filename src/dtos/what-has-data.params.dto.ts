import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MonitorPlanDataTypes } from '../enums/monitor-plan-data-types.enum';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class WhatHasDataParamsDTO {
  @ApiProperty({
    enum: MonitorPlanDataTypes
  })
  @IsString()
  dataType: MonitorPlanDataTypes;

  @ApiPropertyOptional({
    type: Boolean
  })
  @IsOptional()
  @Transform(({ value }) => value === "true")
  workspace: boolean;
}

export default WhatHasDataParamsDTO;