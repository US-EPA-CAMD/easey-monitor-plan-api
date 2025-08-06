import { ApiProperty } from '@nestjs/swagger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsIsoFormat, IsValidDate } from '@us-epa-camd/easey-common/pipes';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidationArguments,
  ValidateIf,
} from 'class-validator';
const KEY = 'Monitor Plan Comment';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import { DATE_FORMAT, MINIMUM_DATE, getMaximumFutureDate } from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';

export class MonitorPlanCommentBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.description,
    example:
      propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.example,
    name:
      propertyMetadata.monitorPlanCommentDTOMonitoringPlanComment.fieldLabels
        .value,
  })
   @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONPLAN-7-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MinLength(1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must exceed 1 character`;
    },
  })
  @MaxLength(4000, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must not exceed 4000 characters`;
    },
  })
  monitoringPlanComment: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOBeginDate.description,
    example: propertyMetadata.monitorPlanCommentDTOBeginDate.example,
    name: propertyMetadata.monitorPlanCommentDTOBeginDate.fieldLabels.value,
  })
   @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONPLAN-4-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })  
  @IsInDateRange(MINIMUM_DATE, getMaximumFutureDate, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONPLAN-4-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format ${DATE_FORMAT}.`;
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
    description: propertyMetadata.monitorPlanCommentDTOEndDate.description,
    example: propertyMetadata.monitorPlanCommentDTOEndDate.example,
    name: propertyMetadata.monitorPlanCommentDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsInDateRange(MINIMUM_DATE, getMaximumFutureDate, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONPLAN-5-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format ${DATE_FORMAT}.`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @BeginEndDatesConsistent({
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('MONPLAN-6-A', {
          datefield2: 'endDate',
          datefield1: 'beginDate',
          key: KEY,
        });
      },
    })
    @ValidateIf(o => o.endDate !== null)
  endDate: Date;
}

export class MonitorPlanCommentDTO extends MonitorPlanCommentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOId.description,
    example: propertyMetadata.monitorPlanCommentDTOId.example,
    name: propertyMetadata.monitorPlanCommentDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOPlanId.description,
    example: propertyMetadata.monitorPlanCommentDTOPlanId.example,
    name: propertyMetadata.monitorPlanCommentDTOPlanId.fieldLabels.value,
  })
  @IsString()
  planId: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOUserId.description,
    example: propertyMetadata.monitorPlanCommentDTOUserId.example,
    name: propertyMetadata.monitorPlanCommentDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOAddDate.description,
    example: propertyMetadata.monitorPlanCommentDTOAddDate.example,
    name: propertyMetadata.monitorPlanCommentDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOUpdateDate.description,
    example: propertyMetadata.monitorPlanCommentDTOUpdateDate.example,
    name: propertyMetadata.monitorPlanCommentDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanCommentDTOActive.description,
    example: propertyMetadata.monitorPlanCommentDTOActive.example,
    name: propertyMetadata.monitorPlanCommentDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
