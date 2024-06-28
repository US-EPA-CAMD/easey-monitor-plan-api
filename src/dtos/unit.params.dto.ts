import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsNumber, IsOptional } from 'class-validator';

import { PaginationDTO } from '@us-epa-camd/easey-common/dtos';

export class UnitParamsDTO extends PaginationDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber()
  facilityId?: number;
}
