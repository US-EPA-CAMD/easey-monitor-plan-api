import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class UpdateMonitorSystemComponentDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOBeginDate.description,
    example: propertyMetadata.monitorSystemDTOBeginDate.example,
    name: propertyMetadata.monitorSystemDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOBeginHour.description,
    example: propertyMetadata.monitorSystemDTOBeginHour.example,
    name: propertyMetadata.monitorSystemDTOBeginHour.fieldLabels.value,
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOEndDate.description,
    example: propertyMetadata.monitorSystemDTOEndDate.example,
    name: propertyMetadata.monitorSystemDTOEndDate.fieldLabels.value,
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOEndHour.description,
    example: propertyMetadata.monitorSystemDTOEndHour.example,
    name: propertyMetadata.monitorSystemDTOEndHour.fieldLabels.value,
  })
  endHour: number;
}
