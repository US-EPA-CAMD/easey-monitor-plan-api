import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorMethodBaseDTO } from './monitor-method-base.dto';

export class MonitorMethodDTO extends MonitorMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOId.description,
    example: propertyMetadata.monitorMethodDTOId.example,
    name: propertyMetadata.monitorMethodDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOLocationId.description,
    example: propertyMetadata.monitorMethodDTOLocationId.example,
    name: propertyMetadata.monitorMethodDTOLocationId.fieldLabels.value
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOUserId.description,
    example: propertyMetadata.monitorMethodDTOUserId.example,
    name: propertyMetadata.monitorMethodDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOAddDate.description,
    example: propertyMetadata.monitorMethodDTOAddDate.example,
    name: propertyMetadata.monitorMethodDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOUpdateDate.description,
    example: propertyMetadata.monitorMethodDTOUpdateDate.example,
    name: propertyMetadata.monitorMethodDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOActive.description,
    example: propertyMetadata.monitorMethodDTOActive.example,
    name: propertyMetadata.monitorMethodDTOActive.fieldLabels.value
  })
  active: boolean;
}
