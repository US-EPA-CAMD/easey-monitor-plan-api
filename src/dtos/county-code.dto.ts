import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class CountyCodeDTO {
  @ApiProperty({
    description: propertyMetadata.countyCode.description,
    example: propertyMetadata.countyCode.example,
    name: propertyMetadata.countyCode.fieldLabels.value,
  })
  countyCode: string;

  countyNumber: string;

  @ApiProperty({
    description: propertyMetadata.county.description,
    example: propertyMetadata.county.example,
    name: propertyMetadata.county.fieldLabels.value,
  })
  countyName: string;

  @ApiProperty({
    description: propertyMetadata.stateCode.description,
    example: propertyMetadata.stateCode.example,
    name: propertyMetadata.stateCode.fieldLabels.value,
  })
  stateCode: string;
}
