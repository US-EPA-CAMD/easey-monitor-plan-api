import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { Transform } from 'class-transformer';

export class MonitorPlanParamsDTO {
  @ApiProperty()
  planId: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  reportedValuesOnly?: boolean;
}
