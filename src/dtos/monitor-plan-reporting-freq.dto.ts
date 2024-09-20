import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  reportFrequencyCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOEndReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOEndReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOEndReportPeriodId.fieldLabels.value,
  })
  @IsNumber()
  @IsOptional()
  beginReportPeriodId?: number;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOBeginReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOBeginReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOBeginReportPeriodId.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber()
  endReportPeriodId?: number;
}

export class MonitorPlanReportingFreqDTO extends MonitorPlanReportingFreqBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanReportingFreqDTOId.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOId.example,
    name: propertyMetadata.monitorPlanReportingFreqDTOId.fieldLabels.value,
  })
  @IsString()
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
  @IsString()
  userId: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorPlanReportingFreqDTOAddDate.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOAddDate.example,
    name: propertyMetadata.monitorPlanReportingFreqDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorPlanReportingFreqDTOUpdateDate.description,
    example: propertyMetadata.monitorPlanReportingFreqDTOUpdateDate.example,
    name:
      propertyMetadata.monitorPlanReportingFreqDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate?: string;

  @IsString()
  @IsOptional()
  endReportPeriodDescription?: string;

  @IsString()
  @IsOptional()
  beginReportPeriodDescription?: string;
}
