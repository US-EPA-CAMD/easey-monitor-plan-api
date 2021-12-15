import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MonitorLocationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOUnitId.description,
    example: propertyMetadata.monitorLocationDTOUnitId.example,
    name: propertyMetadata.monitorLocationDTOUnitId.fieldLabels.value
  })
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOStackPipeId.description,
    example: propertyMetadata.monitorLocationDTOStackPipeId.example,
    name: propertyMetadata.monitorLocationDTOStackPipeId.fieldLabels.value
  })
  stackPipeId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOActiveDate.description,
    example: propertyMetadata.monitorLocationDTOActiveDate.example,
    name: propertyMetadata.monitorLocationDTOActiveDate.fieldLabels.value
  })
  activeDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTORetireDate.description,
    example: propertyMetadata.monitorLocationDTORetireDate.example,
    name: propertyMetadata.monitorLocationDTORetireDate.fieldLabels.value
  })
  retireDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTONonLoadBasedIndicator.description,
    example: propertyMetadata.monitorLocationDTONonLoadBasedIndicator.example,
    name: propertyMetadata.monitorLocationDTONonLoadBasedIndicator.fieldLabels.value
  })
  nonLoadBasedIndicator: number;
}
