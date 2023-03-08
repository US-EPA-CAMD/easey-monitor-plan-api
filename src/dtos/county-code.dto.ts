import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsString } from 'class-validator';

export class CountyCodeDTO {
  @ApiProperty({
    description: propertyMetadata.countyCode.description,
    example: propertyMetadata.countyCode.example,
    name: propertyMetadata.countyCode.fieldLabels.value,
  })
  @IsString()
  countyCode: string;

  @IsString()
  countyNumber: string;

  @ApiProperty({
    description: propertyMetadata.county.description,
    example: propertyMetadata.county.example,
    name: propertyMetadata.county.fieldLabels.value,
  })
  @IsString()
  countyName: string;

  @ApiProperty({
    description: propertyMetadata.stateCode.description,
    example: propertyMetadata.stateCode.example,
    name: propertyMetadata.stateCode.fieldLabels.value,
  })
  @IsString()
  stateCode: string;
}
