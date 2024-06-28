import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class UnitDTO {
  @ApiProperty({
    description: propertyMetadata.unit_id.description,
    example: propertyMetadata.unit_id.example,
    name: propertyMetadata.unit_id.fieldLabels.value,
  })
  id: number;

  @ApiProperty({
    description: propertyMetadata.unitId.description,
    example: propertyMetadata.unitId.example,
    name: propertyMetadata.unitId.fieldLabels.value,
  })
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facilityId: number;
}
