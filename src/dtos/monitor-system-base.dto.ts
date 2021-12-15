import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';


export class MonitorSystemBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOMonitoringSystemId.description,
    example: propertyMetadata.monitorSystemDTOMonitoringSystemId.example,
    name: propertyMetadata.monitorSystemDTOMonitoringSystemId.fieldLabels.value
  })
  monitoringSystemId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOSystemTypeCode.description,
    example: propertyMetadata.monitorSystemDTOSystemTypeCode.example,
    name: propertyMetadata.monitorSystemDTOSystemTypeCode.fieldLabels.value
  })
  systemTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOSystemDesignationCode.description,
    example: propertyMetadata.monitorSystemDTOSystemDesignationCode.example,
    name: propertyMetadata.monitorSystemDTOSystemDesignationCode.fieldLabels.value
  })
  systemDesignationCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOFuelCode.description,
    example: propertyMetadata.monitorSystemDTOFuelCode.example,
    name: propertyMetadata.monitorSystemDTOFuelCode.fieldLabels.value
  })
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOBeginDate.description,
    example: propertyMetadata.monitorSystemDTOBeginDate.example,
    name: propertyMetadata.monitorSystemDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOEndDate.description,
    example: propertyMetadata.monitorSystemDTOEndDate.example,
    name: propertyMetadata.monitorSystemDTOEndDate.fieldLabels.value
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOBeginHour.description,
    example: propertyMetadata.monitorSystemDTOBeginHour.example,
    name: propertyMetadata.monitorSystemDTOBeginHour.fieldLabels.value
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOEndHour.description,
    example: propertyMetadata.monitorSystemDTOEndHour.example,
    name: propertyMetadata.monitorSystemDTOEndHour.fieldLabels.value
  })
  endHour: number;
}
