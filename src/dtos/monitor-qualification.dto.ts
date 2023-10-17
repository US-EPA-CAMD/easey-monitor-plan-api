import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  LEEQualificationBaseDTO,
  LEEQualificationDTO,
} from './lee-qualification.dto';
import {
  LMEQualificationBaseDTO,
  LMEQualificationDTO,
} from './lme-qualification.dto';
import {
  PCTQualificationBaseDTO,
  PCTQualificationDTO,
} from './pct-qualification.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import {
  DATE_FORMAT,
  MAXIMUM_FUTURE_DATE,
  MINIMUM_DATE,
} from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';
import {
  CPMSQualificationBaseDTO,
  CPMSQualificationDTO,
} from './cpms-qualification.dto';
import { IsValidDate } from '@us-epa-camd/easey-common/pipes';

const KEY = 'Monitoring Qualification';

export class MonitorQualificationBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.monitorQualificationDTOQualificationTypeCode.description,
    example:
      propertyMetadata.monitorQualificationDTOQualificationTypeCode.example,
    name:
      propertyMetadata.monitorQualificationDTOQualificationTypeCode.fieldLabels
        .value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    'SELECT qual_type_cd as "value" FROM camdecmpsmd.qual_type_code',
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  qualificationTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOBeginDate.description,
    example: propertyMetadata.monitorQualificationDTOBeginDate.example,
    name: propertyMetadata.monitorQualificationDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('QUAL-18-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOEndDate.description,
    example: propertyMetadata.monitorQualificationDTOEndDate.example,
    name: propertyMetadata.monitorQualificationDTOEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null)
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('QUAL-19-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('QUAL-20-A', {
        datefield2: 'endDate',
        datefield1: 'beginDate',
        key: KEY,
      });
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  endDate: Date;
}

export class UpdateMonitorQualificationDTO extends MonitorQualificationBaseDTO {
  @ValidateNested()
  @Type(() => LEEQualificationBaseDTO)
  monitoringQualificationLEEData: LEEQualificationBaseDTO[];

  @ValidateNested()
  @Type(() => LMEQualificationBaseDTO)
  monitoringQualificationLMEData: LMEQualificationBaseDTO[];

  @ValidateNested()
  @Type(() => PCTQualificationBaseDTO)
  monitoringQualificationPercentData: PCTQualificationBaseDTO[];

  @ValidateNested()
  @Type(() => CPMSQualificationBaseDTO)
  monitoringQualificationCPMSData: CPMSQualificationBaseDTO[];
}

export class MonitorQualificationDTO extends MonitorQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOId.description,
    example: propertyMetadata.monitorQualificationDTOId.example,
    name: propertyMetadata.monitorQualificationDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOLocationId.description,
    example: propertyMetadata.monitorQualificationDTOLocationId.example,
    name: propertyMetadata.monitorQualificationDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOUserId.description,
    example: propertyMetadata.monitorQualificationDTOUserId.example,
    name: propertyMetadata.monitorQualificationDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOAddDate.description,
    example: propertyMetadata.monitorQualificationDTOAddDate.example,
    name: propertyMetadata.monitorQualificationDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOUpdateDate.description,
    example: propertyMetadata.monitorQualificationDTOUpdateDate.example,
    name: propertyMetadata.monitorQualificationDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ValidateNested()
  @Type(() => LEEQualificationDTO)
  monitoringQualificationLEEData: LEEQualificationDTO[];

  @ValidateNested()
  @Type(() => LMEQualificationDTO)
  monitoringQualificationLMEData: LMEQualificationDTO[];

  @ValidateNested()
  @Type(() => PCTQualificationDTO)
  monitoringQualificationPercentData: PCTQualificationDTO[];

  @ValidateNested()
  @Type(() => CPMSQualificationDTO)
  monitoringQualificationCPMSData: CPMSQualificationDTO[];

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOActive.description,
    example: propertyMetadata.monitorQualificationDTOActive.example,
    name: propertyMetadata.monitorQualificationDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
