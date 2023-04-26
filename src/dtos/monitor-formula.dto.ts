import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import {CheckCatalogService} from "@us-epa-camd/easey-common/check-catalog";
import {IsInDateRange} from "../import-checks/pipes/is-in-date-range.pipe";
import {DATE_FORMAT, MAX_HOUR, MAXIMUM_FUTURE_DATE, MIN_HOUR, MINIMUM_DATE} from "../utilities/constants";
import {BeginEndDatesConsistent} from "../utils";

const KEY = 'Formula';

export class MonitorFormulaBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaId.description,
    example: propertyMetadata.monitorFormulaDTOFormulaId.example,
    name: propertyMetadata.monitorFormulaDTOFormulaId.fieldLabels.value,
  })
  @IsNotEmpty()
  @MatchesRegEx('^[A-Z0-9-]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [FORMULA-FATAL-A] The value : ${args.value} for ${args.property} must be match the RegEx: [A-Z0-9-]{1,3}`;
    },
  })
  formulaId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOParameterCode.description,
    example: propertyMetadata.monitorFormulaDTOParameterCode.example,
    name: propertyMetadata.monitorFormulaDTOParameterCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    'SELECT distinct parameter_code as "value" FROM camdecmpsmd.vw_formula_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [FORMULA-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaCode.description,
    example: propertyMetadata.monitorFormulaDTOFormulaCode.example,
    name: propertyMetadata.monitorFormulaDTOFormulaCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct formula_code as "value" FROM camdecmpsmd.vw_formula_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [FORMULA-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  formulaCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaText.description,
    example: propertyMetadata.monitorFormulaDTOFormulaText.example,
    name: propertyMetadata.monitorFormulaDTOFormulaText.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(200, {
    message: (args: ValidationArguments) => {
      return `${args.property} [FORMULA-FATAL-A] The value : ${args.value} for ${args.property} must not exceed 200 characters`;
    },
  })
  formulaText: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOBeginDate.description,
    example: propertyMetadata.monitorFormulaDTOBeginDate.example,
    name: propertyMetadata.monitorFormulaDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-1-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-1-B', {
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
    description: propertyMetadata.monitorFormulaDTOBeginHour.description,
    example: propertyMetadata.monitorFormulaDTOBeginHour.example,
    name: propertyMetadata.monitorFormulaDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-2-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-2-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOEndDate.description,
    example: propertyMetadata.monitorFormulaDTOEndDate.example,
    name: propertyMetadata.monitorFormulaDTOEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.endHour !== null || o.endDate !== null)
  @IsNotEmpty({
        message: (args: ValidationArguments) => {
          return CheckCatalogService.formatResultMessage('FORMULA-5-B', {
            datefield2: args.property,
            hourfield2: 'endHour',
            key: KEY,
          });
        },
      }
  )
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-3-A', {
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
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOEndHour.description,
    example: propertyMetadata.monitorFormulaDTOEndHour.example,
    name: propertyMetadata.monitorFormulaDTOEndHour.fieldLabels.value,
  })
  @IsInt()
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  @IsNotEmpty({
        message: (args: ValidationArguments) => {
          return CheckCatalogService.formatResultMessage('FORMULA-5-A', {
            hourfield2: args.property,
            datefield2: 'endDate',
            key: KEY,
          });
        },
      }
  )
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-4-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(
          'FORMULA-5-C',
          {
            datefield2: 'endDate',
            hourfield2: 'endHour',
            datefield1: 'beginDate',
            hourfield1: 'beginHour',
            key: KEY,
          },
      );
    },
  })
  endHour: number;
}

export class MonitorFormulaDTO extends MonitorFormulaBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOId.description,
    example: propertyMetadata.monitorFormulaDTOId.example,
    name: propertyMetadata.monitorFormulaDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOLocationId.description,
    example: propertyMetadata.monitorFormulaDTOLocationId.example,
    name: propertyMetadata.monitorFormulaDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOUserId.description,
    example: propertyMetadata.monitorFormulaDTOUserId.example,
    name: propertyMetadata.monitorFormulaDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOAddDate.description,
    example: propertyMetadata.monitorFormulaDTOAddDate.example,
    name: propertyMetadata.monitorFormulaDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOUpdateDate.description,
    example: propertyMetadata.monitorFormulaDTOUpdateDate.example,
    name: propertyMetadata.monitorFormulaDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOActive.description,
    example: propertyMetadata.monitorFormulaDTOActive.example,
    name: propertyMetadata.monitorFormulaDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
