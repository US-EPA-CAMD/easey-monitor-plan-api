import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { SystemFuelFlowBaseDTO } from './system-fuel-flow-base.dto';

export class SystemFuelFlowDTO extends SystemFuelFlowBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOId.description,
    example: propertyMetadata.systemFuelFlowDTOId.example,
    name: propertyMetadata.systemFuelFlowDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.description,
    example: propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.example,
    name: propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.fieldLabels.value
  })
  monitoringSystemRecordId: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOFuelCode.description,
    example: propertyMetadata.systemFuelFlowDTOFuelCode.example,
    name: propertyMetadata.systemFuelFlowDTOFuelCode.fieldLabels.value
  })
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOSystemTypeCode.description,
    example: propertyMetadata.systemFuelFlowDTOSystemTypeCode.example,
    name: propertyMetadata.systemFuelFlowDTOSystemTypeCode.fieldLabels.value
  })
  systemTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOUserId.description,
    example: propertyMetadata.systemFuelFlowDTOUserId.example,
    name: propertyMetadata.systemFuelFlowDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOAddDate.description,
    example: propertyMetadata.systemFuelFlowDTOAddDate.example,
    name: propertyMetadata.systemFuelFlowDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOUpdateDate.description,
    example: propertyMetadata.systemFuelFlowDTOUpdateDate.example,
    name: propertyMetadata.systemFuelFlowDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOActive.description,
    example: propertyMetadata.systemFuelFlowDTOActive.example,
    name: propertyMetadata.systemFuelFlowDTOActive.fieldLabels.value
  })
  active: boolean;
}
