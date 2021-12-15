import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class SystemFuelFlowBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.description,
    example: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.example,
    name: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.fieldLabels.value
  })
  maximumFuelFlowRate: number;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.description,
    example: propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.example,
    name: propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.fieldLabels.value
  })
  systemFuelFlowUOMCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRateSourceCode.description,
    example: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRateSourceCode.example,
    name: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRateSourceCode.fieldLabels.value
  })
  maximumFuelFlowRateSourceCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOBeginDate.description,
    example: propertyMetadata.systemFuelFlowDTOBeginDate.example,
    name: propertyMetadata.systemFuelFlowDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOBeginHour.description,
    example: propertyMetadata.systemFuelFlowDTOBeginHour.example,
    name: propertyMetadata.systemFuelFlowDTOBeginHour.fieldLabels.value
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOEndDate.description,
    example: propertyMetadata.systemFuelFlowDTOEndDate.example,
    name: propertyMetadata.systemFuelFlowDTOEndDate.fieldLabels.value
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOEndHour.description,
    example: propertyMetadata.systemFuelFlowDTOEndHour.example,
    name: propertyMetadata.systemFuelFlowDTOEndHour.fieldLabels.value
  })
  endHour: number;
}
