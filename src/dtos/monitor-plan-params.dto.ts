import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';
import { Transform } from 'class-transformer';

export class MonitorPlanParamsDTO extends PaginationDTO {
  @ApiProperty({
    isArray: true,
    description:
      'The Monintor Plan Summary ID is a unique identifier for a monitor plan record',
  })
  @Transform(({ value }) => value.split('|').map((id: string) => id.trim()))
  monitorPlanId: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  reportedValuesOnly?: boolean;
}
