import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
export class MonitorPlanCommentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.description,
    example: propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.example,
    name: propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.fieldLabels.value
  })
  monitoringPlanComment: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOBeginDate.description,
    example: propertyMetadata.monitorPlanCommentDTOBeginDate.example,
    name: propertyMetadata.monitorPlanCommentDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOEndDate.description,
    example: propertyMetadata.monitorPlanCommentDTOEndDate.example,
    name: propertyMetadata.monitorPlanCommentDTOEndDate.fieldLabels.value
  })
  endDate: Date;
}
