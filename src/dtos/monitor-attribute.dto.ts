import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorAttributeBaseDTO } from './monitor-attribute-base.dto';

export class MonitorAttributeDTO extends MonitorAttributeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOId.description,
    example: propertyMetadata.monitorAttributeDTOId.example,
    name: propertyMetadata.monitorAttributeDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOLocationId.description,
    example: propertyMetadata.monitorAttributeDTOLocationId.example,
    name: propertyMetadata.monitorAttributeDTOLocationId.fieldLabels.value
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOUserId.description,
    example: propertyMetadata.monitorAttributeDTOUserId.example,
    name: propertyMetadata.monitorAttributeDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOAddDate.description,
    example: propertyMetadata.monitorAttributeDTOAddDate.example,
    name: propertyMetadata.monitorAttributeDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOUpdateDate.description,
    example: propertyMetadata.monitorAttributeDTOUpdateDate.example,
    name: propertyMetadata.monitorAttributeDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOActive.description,
    example: propertyMetadata.monitorAttributeDTOActive.example,
    name: propertyMetadata.monitorAttributeDTOActive.fieldLabels.value
  })
  active: boolean;
}
