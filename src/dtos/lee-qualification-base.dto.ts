import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class LEEQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOQualificationTestDate.description,
    example: propertyMetadata.lEEQualificationDTOQualificationTestDate.example,
    name: propertyMetadata.lEEQualificationDTOQualificationTestDate.fieldLabels.value
  })
  qualificationTestDate: Date;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOParameterCode.description,
    example: propertyMetadata.lEEQualificationDTOParameterCode.example,
    name: propertyMetadata.lEEQualificationDTOParameterCode.fieldLabels.value
  })
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOQualificationTestType.description,
    example: propertyMetadata.lEEQualificationDTOQualificationTestType.example,
    name: propertyMetadata.lEEQualificationDTOQualificationTestType.fieldLabels.value
  })
  qualificationTestType: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOPotentialAnnualMassEmissions.description,
    example: propertyMetadata.lEEQualificationDTOPotentialAnnualMassEmissions.example,
    name: propertyMetadata.lEEQualificationDTOPotentialAnnualMassEmissions.fieldLabels.value
  })
  potentialAnnualHgMassEmissions: number;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOApplicableEmissionStandard.description,
    example: propertyMetadata.lEEQualificationDTOApplicableEmissionStandard.example,
    name: propertyMetadata.lEEQualificationDTOApplicableEmissionStandard.fieldLabels.value
  })
  applicableEmissionStandard: number;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOUnitsOfStandard.description,
    example: propertyMetadata.lEEQualificationDTOUnitsOfStandard.example,
    name: propertyMetadata.lEEQualificationDTOUnitsOfStandard.fieldLabels.value
  })
  unitsOfStandard: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOPercentageOfEmissionStandard.description,
    example: propertyMetadata.lEEQualificationDTOPercentageOfEmissionStandard.example,
    name: propertyMetadata.lEEQualificationDTOPercentageOfEmissionStandard.fieldLabels.value
  })
  percentageOfEmissionStandard: number;
}
