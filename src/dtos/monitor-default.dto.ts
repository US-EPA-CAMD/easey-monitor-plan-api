import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { BeginEndDatesConsistent } from '../utils';

import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  DATE_FORMAT,
  MAX_HOUR,
  MAXIMUM_FUTURE_DATE,
  MIN_HOUR,
  MINIMUM_DATE,
} from '../utilities/constants';
import { FuelCode } from '../entities/fuel-code.entity';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';

const KEY = 'Monitor Default';

export class MonitorDefaultBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOParameterCode.description,
    example: propertyMetadata.monitorDefaultDTOParameterCode.example,
    name: propertyMetadata.monitorDefaultDTOParameterCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-47-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDbValues(
    'SELECT distinct parameter_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatMessage(
          `The value for [fieldname] for [key] is invalid`,
          {
            fieldname: args.property,
            key: KEY,
          },
        );
      },
    },
  )
  @IsString()
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTODefaultValue.description,
    example: propertyMetadata.monitorDefaultDTODefaultValue.example,
    name: propertyMetadata.monitorDefaultDTODefaultValue.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-49-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    0,
    99999999999.9999,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatMessage(
          `The value of [value] for [fieldname] must be within the range of 0 and 99999999999.9999 for [key].`,
          {
            value: args.value,
            fieldname: args.property,
            key: KEY,
          },
        );
      },
    },
    false,
  )
  @IsNumber(
    { maxDecimalPlaces: 4 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only four decimal place for [${KEY}].`;
      },
    },
  )
  defaultValue: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.description,
    example:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.example,
    name:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.fieldLabels
        .value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-50-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatMessage(
          `The value for [fieldname] for [key] is invalid`,
          {
            fieldname: args.property,
            key: KEY,
          },
        );
      },
    },
  )
  @ValidateIf(o => o.defaultUnitsOfMeasureCode || o.endDate === null || o.endHour === null)
  defaultUnitsOfMeasureCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultPurposeCode.description,
    example: propertyMetadata.monitorDefaultDTODefaultPurposeCode.example,
    name:
      propertyMetadata.monitorDefaultDTODefaultPurposeCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-51-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDbValues(
    'SELECT distinct purpose_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatMessage(
          `The value for [fieldname] for [key] is invalid`,
          {
            fieldname: args.property,
            key: KEY,
          },
        );
      },
    },
  )
  @IsString()
  @ValidateIf(o => o.defaultPurposeCode || o.endDate === null || o.endHour === null)
  defaultPurposeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOFuelCode.description,
    example: propertyMetadata.monitorDefaultDTOFuelCode.example,
    name: propertyMetadata.monitorDefaultDTOFuelCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-53-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(FuelCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-53-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @ValidateIf(o => o.fuelCode || o.endDate === null || o.endHour === null)
  fuelCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTOOperatingConditionCode.description,
    example: propertyMetadata.monitorDefaultDTOOperatingConditionCode.example,
    name:
      propertyMetadata.monitorDefaultDTOOperatingConditionCode.fieldLabels
        .value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-48-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDbValues(
    'SELECT distinct operating_condition_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatMessage(
          `The value for [fieldname] for [key] is invalid`,
          {
            fieldname: args.property,
            key: KEY,
          },
        );
      },
    },
  )
  @IsString()
  @ValidateIf(o => o.operatingConditionCode || o.endDate === null || o.endHour === null)
  operatingConditionCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultSourceCode.description,
    example: propertyMetadata.monitorDefaultDTODefaultSourceCode.example,
    name: propertyMetadata.monitorDefaultDTODefaultSourceCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-52-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDbValues(
    'SELECT distinct source_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatMessage(
          `The value for [fieldname] for [key] is invalid`,
          {
            fieldname: args.property,
            key: KEY,
          },
        );
      },
    },
  )
  @IsString()
  @ValidateIf(o => o.defaultSourceCode || o.endDate === null || o.endHour === null)
  defaultSourceCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOGroupId.description,
    example: propertyMetadata.monitorDefaultDTOGroupId.example,
    name: propertyMetadata.monitorDefaultDTOGroupId.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(10, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must not exceed 10 characters`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsString()
  groupId: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOBeginDate.description,
    example: propertyMetadata.monitorDefaultDTOBeginDate.example,
    name: propertyMetadata.monitorDefaultDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-39-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-39-B', {
        fieldname: args.property,
        date: args.value,
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
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOBeginHour.description,
    example: propertyMetadata.monitorDefaultDTOBeginHour.example,
    name: propertyMetadata.monitorDefaultDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-40-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-40-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOEndDate.description,
    example: propertyMetadata.monitorDefaultDTOEndDate.example,
    name: propertyMetadata.monitorDefaultDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-38-B', {
        datefield2: args.property,
        hourfield2: 'endHour',
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-41-A', {
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOEndHour.description,
    example: propertyMetadata.monitorDefaultDTOEndHour.example,
    name: propertyMetadata.monitorDefaultDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-38-A', {
        hourfield2: args.property,
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-42-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-38-C', {
        datefield2: 'endDate',
        hourfield2: 'endHour',
        datefield1: 'beginDate',
        hourfield1: 'beginHour',
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.endHour !== null || o.endDate !== null)
  endHour: number;
}

export class MonitorDefaultDTO extends MonitorDefaultBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOId.description,
    example: propertyMetadata.monitorDefaultDTOId.example,
    name: propertyMetadata.monitorDefaultDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOLocationId.description,
    example: propertyMetadata.monitorDefaultDTOLocationId.example,
    name: propertyMetadata.monitorDefaultDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOUserId.description,
    example: propertyMetadata.monitorDefaultDTOUserId.example,
    name: propertyMetadata.monitorDefaultDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOAddDate.description,
    example: propertyMetadata.monitorDefaultDTOAddDate.example,
    name: propertyMetadata.monitorDefaultDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOUpdateDate.description,
    example: propertyMetadata.monitorDefaultDTOUpdateDate.example,
    name: propertyMetadata.monitorDefaultDTOUpdateDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOActive.description,
    example: propertyMetadata.monitorDefaultDTOActive.example,
    name: propertyMetadata.monitorDefaultDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
