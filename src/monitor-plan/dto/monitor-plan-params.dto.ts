import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';

export class MonitorPlanParamsDTO extends PaginationDTO {
  @IsOptional()
  @ApiPropertyOptional()
  facId: number;
  @IsOptional()
  @ApiPropertyOptional()
  orisCode: number;
}
