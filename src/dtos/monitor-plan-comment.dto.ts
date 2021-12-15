import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorPlanCommentBaseDTO } from './monitor-plan-comment-base.dto';

export class MonitorPlanCommentDTO extends MonitorPlanCommentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOId.description,
    example: propertyMetadata.monitorPlanCommentDTOId.example,
    name: propertyMetadata.monitorPlanCommentDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOPlanId.description,
    example: propertyMetadata.monitorPlanCommentDTOPlanId.example,
    name: propertyMetadata.monitorPlanCommentDTOPlanId.fieldLabels.value
  })
  planId: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOUserId.description,
    example: propertyMetadata.monitorPlanCommentDTOUserId.example,
    name: propertyMetadata.monitorPlanCommentDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOAddDate.description,
    example: propertyMetadata.monitorPlanCommentDTOAddDate.example,
    name: propertyMetadata.monitorPlanCommentDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOUpdateDate.description,
    example: propertyMetadata.monitorPlanCommentDTOUpdateDate.example,
    name: propertyMetadata.monitorPlanCommentDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOActive.description,
    example: propertyMetadata.monitorPlanCommentDTOActive.example,
    name: propertyMetadata.monitorPlanCommentDTOActive.fieldLabels.value
  })
  active: boolean;
}
