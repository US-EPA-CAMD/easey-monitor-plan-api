import { ApiProperty } from '@nestjs/swagger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
} from '@us-epa-camd/easey-common/pipes';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import {
  DATE_FORMAT,
  MAXIMUM_FUTURE_DATE,
  MAX_HOUR,
  MINIMUM_DATE,
  MIN_HOUR,
} from '../utilities/constants';
import { AnalyzerRangeCode } from '../entities/analyzer-range-code.entity';

const KEY = 'Analyzer Range';
export class AnalyzerRangeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.description,
    example: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.example,
    name: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-16-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(AnalyzerRangeCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-16-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  analyzerRangeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.analyzerRangeDTODualRangeIndicator.description,
    example: propertyMetadata.analyzerRangeDTODualRangeIndicator.example,
    name: propertyMetadata.analyzerRangeDTODualRangeIndicator.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-37-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  dualRangeIndicator: number;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOBeginDate.description,
    example: propertyMetadata.analyzerRangeDTOBeginDate.example,
    name: propertyMetadata.analyzerRangeDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-18-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-18-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldName] in the [key] record must be a valid ISO date format [dateFormat]`,
        {
          fieldName: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOBeginHour.description,
    example: propertyMetadata.analyzerRangeDTOBeginHour.example,
    name: propertyMetadata.analyzerRangeDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-19-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-19-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOEndDate.description,
    example: propertyMetadata.analyzerRangeDTOEndDate.example,
    name: propertyMetadata.analyzerRangeDTOEndDate.fieldLabels.value,
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-20-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldName] in the [key] record must be a valid ISO date format [dateFormat]`,
        {
          fieldName: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOEndHour.description,
    example: propertyMetadata.analyzerRangeDTOEndHour.example,
    name: propertyMetadata.analyzerRangeDTOEndHour.fieldLabels.value,
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-21-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endHour: number;
}

export class AnalyzerRangeDTO extends AnalyzerRangeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOId.description,
    example: propertyMetadata.analyzerRangeDTOId.example,
    name: propertyMetadata.analyzerRangeDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOComponentRecordId.description,
    example: propertyMetadata.analyzerRangeDTOComponentRecordId.example,
    name: propertyMetadata.analyzerRangeDTOComponentRecordId.fieldLabels.value,
  })
  @IsString()
  componentRecordId: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOUserId.description,
    example: propertyMetadata.analyzerRangeDTOUserId.example,
    name: propertyMetadata.analyzerRangeDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOAddDate.description,
    example: propertyMetadata.analyzerRangeDTOAddDate.example,
    name: propertyMetadata.analyzerRangeDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOUpdateDate.description,
    example: propertyMetadata.analyzerRangeDTOUpdateDate.example,
    name: propertyMetadata.analyzerRangeDTOUpdateDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOActive.description,
    example: propertyMetadata.analyzerRangeDTOActive.example,
    name: propertyMetadata.analyzerRangeDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
