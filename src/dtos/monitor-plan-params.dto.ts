import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { Transform } from 'class-transformer';

export class MonitorPlanParamsDTO {
  @ApiProperty({
    isArray: true,
    description:
      'The Monintor Plan Summary ID is a unique identifier for a monitor plan record',
  })
  @Transform(({ value }) => value.split('|').map((id: string) => id.trim()))
  planId: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  reportedValuesOnly?: boolean;
}
