import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorPlanCommentDTO } from './monitor-plan-comment.dto';
import { UnitStackConfigurationDTO } from './unit-stack-configuration.dto';
import { MonitorLocationDTO } from './monitor-location.dto';
import { MonitorPlanReportingFreqDTO } from './monitor-plan-reporting-freq.dto';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class MonitorPlanDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOId.description,
    example: propertyMetadata.monitorPlanDTOId.example,
    name: propertyMetadata.monitorPlanDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOOrisCode.description,
    example: propertyMetadata.monitorPlanDTOOrisCode.example,
    name: propertyMetadata.monitorPlanDTOOrisCode.fieldLabels.value,
  })
  @IsNumber()
  orisCode: number;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  @IsNumber()
  facId: number;

  @IsString()
  facilityName: string;

  @IsString()
  @IsOptional()
  configTypeCode: string;

  @IsDateString()
  @IsOptional()
  lastUpdated: Date;

  @IsString()
  @IsOptional()
  updatedStatusFlag: string;

  @IsString()
  @IsOptional()
  needsEvalFlag: string;

  @IsString()
  @IsOptional()
  checkSessionId: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOName.description,
    example: propertyMetadata.monitorPlanDTOName.example,
    name: propertyMetadata.monitorPlanDTOName.fieldLabels.value,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOEndReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOEndReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOEndReportPeriodId.fieldLabels.value,
  })
  @IsNumber()
  @IsOptional()
  endReportPeriodId: number;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOBeginReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOBeginReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOBeginReportPeriodId.fieldLabels.value,
  })
  @IsNumber()
  beginReportPeriodId: number;

  @IsBoolean()
  active: boolean;

  @ValidateNested({ each: true })
  @Type(() => MonitorPlanCommentDTO)
  comments: MonitorPlanCommentDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitStackConfigurationDTO)
  unitStackConfigurations: UnitStackConfigurationDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorPlanReportingFreqDTO)
  reportingFrequencies: MonitorPlanReportingFreqDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorLocationDTO)
  locations: MonitorLocationDTO[];

  @IsString()
  @IsOptional()
  pendingStatusCode: string;

  @IsString()
  @IsOptional()
  evalStatusCode: string;

  @IsString()
  userId: string;

  @IsDateString()
  addDate: string;

  @IsDateString()
  @IsOptional()
  updateDate: string;

  @IsNumber()
  @IsOptional()
  submissionId: number;

  @IsString()
  @IsOptional()
  submissionAvailabilityCode: string;

  @IsDateString()
  @IsOptional()
  lastEvaluatedDate: Date;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  reportedValuesOnly?: boolean;
}
