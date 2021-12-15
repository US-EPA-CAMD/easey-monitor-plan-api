import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorDefaultBaseDTO } from './monitor-default-base.dto';

export class MonitorDefaultDTO extends MonitorDefaultBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOId.description,
    example: propertyMetadata.monitorDefaultDTOId.example,
    name: propertyMetadata.monitorDefaultDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOLocationId.description,
    example: propertyMetadata.monitorDefaultDTOLocationId.example,
    name: propertyMetadata.monitorDefaultDTOLocationId.fieldLabels.value
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOUserId.description,
    example: propertyMetadata.monitorDefaultDTOUserId.example,
    name: propertyMetadata.monitorDefaultDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOAddDate.description,
    example: propertyMetadata.monitorDefaultDTOAddDate.example,
    name: propertyMetadata.monitorDefaultDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOUpdateDate.description,
    example: propertyMetadata.monitorDefaultDTOUpdateDate.example,
    name: propertyMetadata.monitorDefaultDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOActive.description,
    example: propertyMetadata.monitorDefaultDTOActive.example,
    name: propertyMetadata.monitorDefaultDTOActive.fieldLabels.value
  })
  active: boolean;
}
