import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';

export class MonitorPlanParamsDTO extends PaginationDTO {
  @IsOptional()
  @ApiPropertyOptional()
  facId: number;

  @ApiProperty()
  orisCode: number;

  @IsOptional()
  @ApiPropertyOptional()
  active: boolean;
}
