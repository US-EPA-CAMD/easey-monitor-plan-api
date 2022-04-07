import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { MonitorSpanBaseDTO } from './monitor-span-base.dto';

export class MonitorSpanDTO extends MonitorSpanBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOId.description,
    example: propertyMetadata.monitorSpanDTOId.example,
    name: propertyMetadata.monitorSpanDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOLocationId.description,
    example: propertyMetadata.monitorSpanDTOLocationId.example,
    name: propertyMetadata.monitorSpanDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOUserid.description,
    example: propertyMetadata.monitorSpanDTOUserid.example,
    name: propertyMetadata.monitorSpanDTOUserid.fieldLabels.value,
  })
  userid: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOAddDate.description,
    example: propertyMetadata.monitorSpanDTOAddDate.example,
    name: propertyMetadata.monitorSpanDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOUpdateDate.description,
    example: propertyMetadata.monitorSpanDTOUpdateDate.example,
    name: propertyMetadata.monitorSpanDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOActive.description,
    example: propertyMetadata.monitorSpanDTOActive.example,
    name: propertyMetadata.monitorSpanDTOActive.fieldLabels.value,
  })
  active: boolean;
}
