import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { SystemComponentBaseDTO } from './system-component-base.dto';

export class SystemComponentDTO extends SystemComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemComponentDTOId.description,
    example: propertyMetadata.systemComponentDTOId.example,
    name: propertyMetadata.systemComponentDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOLocationId.description,
    example: propertyMetadata.systemComponentDTOLocationId.example,
    name: propertyMetadata.systemComponentDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.description,
    example:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.example,
    name:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.fieldLabels
        .value,
  })
  monitoringSystemRecordId: string;

  @ApiProperty({
    description:
      propertyMetadata.systemComponentDTOComponentRecordId.description,
    example: propertyMetadata.systemComponentDTOComponentRecordId.example,
    name:
      propertyMetadata.systemComponentDTOComponentRecordId.fieldLabels.value,
  })
  componentRecordId: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOUserId.description,
    example: propertyMetadata.systemComponentDTOUserId.example,
    name: propertyMetadata.systemComponentDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOAddDate.description,
    example: propertyMetadata.systemComponentDTOAddDate.example,
    name: propertyMetadata.systemComponentDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOUpdateDate.description,
    example: propertyMetadata.systemComponentDTOUpdateDate.example,
    name: propertyMetadata.systemComponentDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOActive.description,
    example: propertyMetadata.systemComponentDTOActive.example,
    name: propertyMetadata.systemComponentDTOActive.fieldLabels.value,
  })
  active: boolean;
}
