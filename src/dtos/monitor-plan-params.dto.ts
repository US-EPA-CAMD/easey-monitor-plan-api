import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';

export class MonitorPlanParamsDTO extends PaginationDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value
  })
  @IsOptional()
  @ApiPropertyOptional()
  facId: number;

  @ApiProperty()
  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOOrisCode.description,
    example: propertyMetadata.monitorPlanDTOOrisCode.example,
    name: propertyMetadata.monitorPlanDTOOrisCode.fieldLabels.value
  })
  orisCode: number;

  @IsOptional()
  @ApiPropertyOptional()
  active: boolean;
}
