import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class UnitFuelBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitFuelDTOFuelCode.description,
    example: propertyMetadata.unitFuelDTOFuelCode.example,
    name: propertyMetadata.unitFuelDTOFuelCode.fieldLabels.value
  })
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOIndicatorCode.description,
    example: propertyMetadata.unitFuelDTOIndicatorCode.example,
    name: propertyMetadata.unitFuelDTOIndicatorCode.fieldLabels.value
  })
  indicatorCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.description,
    example: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.example,
    name: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.fieldLabels.value
  })
  ozoneSeasonIndicator: number;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTODemGCV.description,
    example: propertyMetadata.unitFuelDTODemGCV.example,
    name: propertyMetadata.unitFuelDTODemGCV.fieldLabels.value
  })
  demGCV: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTODemSO2.description,
    example: propertyMetadata.unitFuelDTODemSO2.example,
    name: propertyMetadata.unitFuelDTODemSO2.fieldLabels.value
  })
  demSO2: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOBeginDate.description,
    example: propertyMetadata.unitFuelDTOBeginDate.example,
    name: propertyMetadata.unitFuelDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOEndDate.description,
    example: propertyMetadata.unitFuelDTOEndDate.example,
    name: propertyMetadata.unitFuelDTOEndDate.fieldLabels.value
  })
  endDate: Date;
}
