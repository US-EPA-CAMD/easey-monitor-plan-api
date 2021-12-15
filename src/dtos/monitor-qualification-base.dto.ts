import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MonitorQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOQualificationTypeCode.description,
    example: propertyMetadata.monitorQualificationDTOQualificationTypeCode.example,
    name: propertyMetadata.monitorQualificationDTOQualificationTypeCode.fieldLabels.value
  })
  qualificationTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOBeginDate.description,
    example: propertyMetadata.monitorQualificationDTOBeginDate.example,
    name: propertyMetadata.monitorQualificationDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOEndDate.description,
    example: propertyMetadata.monitorQualificationDTOEndDate.example,
    name: propertyMetadata.monitorQualificationDTOEndDate.fieldLabels.value
  })
  endDate: Date;
}
