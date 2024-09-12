import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class ReportingFreqBaseDTO {

  @ApiProperty({
    description: propertyMetadata.reportingFreqDTOReportFrequencyCode.description,
    example: propertyMetadata.reportingFreqDTOReportFrequencyCode.example,
    name: propertyMetadata.reportingFreqDTOReportFrequencyCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsString()
  reportFrequencyCode: string;

  @ApiProperty({
    description: propertyMetadata.reportingFreqDTOMonitoringPlanLocations.description,
    example: propertyMetadata.reportingFreqDTOMonitoringPlanLocations.example,
    name: propertyMetadata.reportingFreqDTOMonitoringPlanLocations.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsString()
  monitoringPlanLocations: string;

  @ApiProperty({
    description: propertyMetadata.reportingFreqDTOBeginQuarter.description,
    example: propertyMetadata.reportingFreqDTOBeginQuarter.example,
    name: propertyMetadata.reportingFreqDTOBeginQuarter.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsString()
  beginQuarter: string;

  @ApiProperty({
    description: propertyMetadata.reportingFreqDTOEndQuarter.description,
    example: propertyMetadata.reportingFreqDTOEndQuarter.example,
    name: propertyMetadata.reportingFreqDTOEndQuarter.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  endQuarter: string;
}

export class ReportingFreqDTO extends ReportingFreqBaseDTO {
  @ApiProperty({
    description: propertyMetadata.reportingFreqDTOId.description,
    example: propertyMetadata.reportingFreqDTOId.example,
    name: propertyMetadata.reportingFreqDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.reportingFreqDTOActive.description,
    example: propertyMetadata.reportingFreqDTOActive.example,
    name: propertyMetadata.reportingFreqDTOActive.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  active: boolean;
}
