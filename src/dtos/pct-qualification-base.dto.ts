import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class PCTQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: propertyMetadata.year.fieldLabels.value
  })
  qualificationYear: number;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOAveragePercentValue.description,
    example: propertyMetadata.pCTQualificationDTOAveragePercentValue.example,
    name: propertyMetadata.pCTQualificationDTOAveragePercentValue.fieldLabels.value
  })
  averagePercentValue: number;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr1QualificationDataYear.description,
    example: propertyMetadata.pCTQualificationDTOYr1QualificationDataYear.example,
    name: propertyMetadata.pCTQualificationDTOYr1QualificationDataYear.fieldLabels.value
  })
  yr1QualificationDataYear: number;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr1QualificationDataTypeCode.description,
    example: propertyMetadata.pCTQualificationDTOYr1QualificationDataTypeCode.example,
    name: propertyMetadata.pCTQualificationDTOYr1QualificationDataTypeCode.fieldLabels.value
  })
  yr1QualificationDataTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr1PercentageValue.description,
    example: propertyMetadata.pCTQualificationDTOYr1PercentageValue.example,
    name: propertyMetadata.pCTQualificationDTOYr1PercentageValue.fieldLabels.value
  })
  yr1PercentageValue: number;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr2QualificationDataYear.description,
    example: propertyMetadata.pCTQualificationDTOYr2QualificationDataYear.example,
    name: propertyMetadata.pCTQualificationDTOYr2QualificationDataYear.fieldLabels.value
  })
  yr2QualificationDataYear: number;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr2QualificationDataTypeCode.description,
    example: propertyMetadata.pCTQualificationDTOYr2QualificationDataTypeCode.example,
    name: propertyMetadata.pCTQualificationDTOYr2QualificationDataTypeCode.fieldLabels.value
  })
  yr2QualificationDataTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr2PercentageValue.description,
    example: propertyMetadata.pCTQualificationDTOYr2PercentageValue.example,
    name: propertyMetadata.pCTQualificationDTOYr2PercentageValue.fieldLabels.value
  })
  yr2PercentageValue: number;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr3QualificationDataYear.description,
    example: propertyMetadata.pCTQualificationDTOYr3QualificationDataYear.example,
    name: propertyMetadata.pCTQualificationDTOYr3QualificationDataYear.fieldLabels.value
  })
  yr3QualificationDataYear: number;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr3QualificationDataTypeCode.description,
    example: propertyMetadata.pCTQualificationDTOYr3QualificationDataTypeCode.example,
    name: propertyMetadata.pCTQualificationDTOYr3QualificationDataTypeCode.fieldLabels.value
  })
  yr3QualificationDataTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOYr3PercentageValue.description,
    example: propertyMetadata.pCTQualificationDTOYr3PercentageValue.example,
    name: propertyMetadata.pCTQualificationDTOYr3PercentageValue.fieldLabels.value
  })
  yr3PercentageValue: number;
}
