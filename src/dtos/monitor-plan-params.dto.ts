import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { Transform } from 'class-transformer';

export class MonitorPlanParamsDTO {
  @ApiProperty({
    description:
      'The Monintor Plan Summary ID is a unique identifier for a monitor plan record',
  })
  planId: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  reportedValuesOnly?: boolean;
}
