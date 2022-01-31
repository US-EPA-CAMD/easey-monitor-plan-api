import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class LMEQualificationBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.lMEQualificationDTOQualificationDataYear.description,
    example: propertyMetadata.lMEQualificationDTOQualificationDataYear.example,
    name:
      propertyMetadata.lMEQualificationDTOQualificationDataYear.fieldLabels
        .value,
  })
  qualificationDataYear: number;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOOperatingHours.description,
    example: propertyMetadata.lMEQualificationDTOOperatingHours.example,
    name: propertyMetadata.lMEQualificationDTOOperatingHours.fieldLabels.value,
  })
  operatingHours: number;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOSo2Tons.description,
    example: propertyMetadata.lMEQualificationDTOSo2Tons.example,
    name: propertyMetadata.lMEQualificationDTOSo2Tons.fieldLabels.value,
  })
  so2Tons: number;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTONoxTons.description,
    example: propertyMetadata.lMEQualificationDTONoxTons.example,
    name: propertyMetadata.lMEQualificationDTONoxTons.fieldLabels.value,
  })
  noxTons: number;
}
