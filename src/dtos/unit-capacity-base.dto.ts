import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class UnitCapacityBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity.description,
    example: propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity.example,
    name: propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity.fieldLabels.value
  })
  maximumHourlyHeatInputCapacity: number;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOBeginDate.description,
    example: propertyMetadata.unitCapacityDTOBeginDate.example,
    name: propertyMetadata.unitCapacityDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOEndDate.description,
    example: propertyMetadata.unitCapacityDTOEndDate.example,
    name: propertyMetadata.unitCapacityDTOEndDate.fieldLabels.value
  })
  endDate: Date;
}
