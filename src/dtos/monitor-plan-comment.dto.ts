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
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { DATE_FORMAT } from '../utilities/constants';

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
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
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
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
      );
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
