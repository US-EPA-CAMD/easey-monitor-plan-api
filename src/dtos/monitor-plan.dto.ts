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
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Plant } from '../entities/plant.entity';
import { FindOneOptions } from 'typeorm';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DbLookup } from '@us-epa-camd/easey-common/pipes';

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
  @DbLookup(
    Plant,
    (args: ValidationArguments): FindOneOptions<Plant> => {
      return { where: { orisCode: args.value } };
    },
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('IMPORT-24-A', {
          orisCode: args.value,
        });
      },
    },
  )
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

  @IsString()
  @IsOptional()
  endReportPeriodDescription?: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOBeginReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOBeginReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOBeginReportPeriodId.fieldLabels.value,
  })
  @IsNumber()
  beginReportPeriodId: number;

  @IsString()
  @IsOptional()
  beginReportPeriodDescription?: string;

  @IsBoolean()
  active: boolean;

  @ValidateNested({ each: true })
  @Type(() => MonitorPlanCommentDTO)
  monitoringPlanCommentData: MonitorPlanCommentDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitStackConfigurationDTO)
  unitStackConfigurationData: UnitStackConfigurationDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorPlanReportingFreqDTO)
  reportingFrequencies: MonitorPlanReportingFreqDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorLocationDTO)
  monitoringLocationData: MonitorLocationDTO[];

  @IsString()
  @IsOptional()
  pendingStatusCode: string;

  @IsString()
  @IsOptional()
  evalStatusCode: string;

  @IsString()
  @IsOptional()
  evalStatusCodeDescription: string;

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

  @IsString()
  @IsOptional()
  submissionAvailabilityCodeDescription: string;

  @IsDateString()
  @IsOptional()
  lastEvaluatedDate: Date;
}
