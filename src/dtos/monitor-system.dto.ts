import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorSystemBaseDTO } from './monitor-system-base.dto';
import { SystemComponentDTO } from './system-component.dto';
import { SystemFuelFlowDTO } from './system-fuel-flow.dto';

export class MonitorSystemDTO extends MonitorSystemBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOId.description,
    example: propertyMetadata.monitorSystemDTOId.example,
    name: propertyMetadata.monitorSystemDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOLocationId.description,
    example: propertyMetadata.monitorSystemDTOLocationId.example,
    name: propertyMetadata.monitorSystemDTOLocationId.fieldLabels.value
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOUserId.description,
    example: propertyMetadata.monitorSystemDTOUserId.example,
    name: propertyMetadata.monitorSystemDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOAddDate.description,
    example: propertyMetadata.monitorSystemDTOAddDate.example,
    name: propertyMetadata.monitorSystemDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOUpdateDate.description,
    example: propertyMetadata.monitorSystemDTOUpdateDate.example,
    name: propertyMetadata.monitorSystemDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOActive.description,
    example: propertyMetadata.monitorSystemDTOActive.example,
    name: propertyMetadata.monitorSystemDTOActive.fieldLabels.value
  })
  active: boolean;
  components: SystemComponentDTO[];
  fuelFlows: SystemFuelFlowDTO[];
}
