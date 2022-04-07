import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorLoadBaseDTO } from './monitor-load-base.dto';

export class MonitorLoadDTO extends MonitorLoadBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOId.description,
    example: propertyMetadata.monitorLoadDTOId.example,
    name: propertyMetadata.monitorLoadDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOLocationId.description,
    example: propertyMetadata.monitorLoadDTOLocationId.example,
    name: propertyMetadata.monitorLoadDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOUserId.description,
    example: propertyMetadata.monitorLoadDTOUserId.example,
    name: propertyMetadata.monitorLoadDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOAddDate.description,
    example: propertyMetadata.monitorLoadDTOAddDate.example,
    name: propertyMetadata.monitorLoadDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOUpdateDate.description,
    example: propertyMetadata.monitorLoadDTOUpdateDate.example,
    name: propertyMetadata.monitorLoadDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOActive.description,
    example: propertyMetadata.monitorLoadDTOActive.example,
    name: propertyMetadata.monitorLoadDTOActive.fieldLabels.value,
  })
  active: boolean;
}
