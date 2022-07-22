import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MonitorPlanReportingFreqBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata
        .monitorPlanReportingFreqDTOMonitoringPlanReportingFreqCode.description,
    example:
      propertyMetadata
        .monitorPlanReportingFreqDTOMonitoringPlanReportingFreqCode.example,
    name:
      propertyMetadata
        .monitorPlanReportingFreqDTOMonitoringPlanReportingFreqCode.fieldLabels
        .value,
  })
  reportFrequencyCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOEndReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOEndReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOEndReportPeriodId.fieldLabels.value,
  })
  beginReportPeriodId: number;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOBeginReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOBeginReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOBeginReportPeriodId.fieldLabels.value,
  })
  endReportPeriodId: number;
}

export class MonitorPlanReportingFreqDTO extends MonitorPlanReportingFreqBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanReportingFreqDTOId.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOId.example,
    name: propertyMetadata.monitorPlanReportingFreqDTOId.fieldLabels.value,
  })
  id: string;

  /* @ApiProperty({
    description: propertyMetadata.monitorPlanReportingFreqDTOPlanId.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOPlanId.example,
    name: propertyMetadata.monitorPlanReportingFreqDTOPlanId.fieldLabels.value,
  })
  planId: string; */

  @ApiProperty({
    description: propertyMetadata.monitorPlanReportingFreqDTOUserId.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOUserId.example,
    name: propertyMetadata.monitorPlanReportingFreqDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorPlanReportingFreqDTOAddDate.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOAddDate.example,
    name: propertyMetadata.monitorPlanReportingFreqDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description:
      propertyMetadata.monitorPlanReportingFreqDTOUpdateDate.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOUpdateDate.example,
    name:
      propertyMetadata.monitorPlanReportingFreqDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;
}
