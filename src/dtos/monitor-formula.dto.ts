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

import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import {
  DATE_FORMAT,
  MAX_HOUR,
  MAXIMUM_FUTURE_DATE,
  MIN_HOUR,
  MINIMUM_DATE,
} from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';
import { EquationCode } from '../entities/equation-code.entity';
import { FormulaMdRelationshipsView } from '../entities/formula-md-relationships-view.entity';

const KEY = 'Monitor Formula';

export class MonitorFormulaBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaId.description,
    example: propertyMetadata.monitorFormulaDTOFormulaId.example,
    name: propertyMetadata.monitorFormulaDTOFormulaId.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-7-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MatchesRegEx('^[A-Z0-9\\-]{1,3}$', {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-7-B', {
        iD: args.value,
      });
    },
  })
  formulaId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOParameterCode.description,
    example: propertyMetadata.monitorFormulaDTOParameterCode.example,
    name: propertyMetadata.monitorFormulaDTOParameterCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-8-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(FormulaMdRelationshipsView, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-8-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaCode.description,
    example: propertyMetadata.monitorFormulaDTOFormulaCode.example,
    name: propertyMetadata.monitorFormulaDTOFormulaCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-9-A', {
        key: KEY,
      });
    },
  })
  @IsValidCode(EquationCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-9-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.formulaText === null || o.formulaCode !== null)
  formulaCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaText.description,
    example: propertyMetadata.monitorFormulaDTOFormulaText.example,
    name: propertyMetadata.monitorFormulaDTOFormulaText.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(200, {
    message: (args: ValidationArguments) => {
      return `The value : [${args.value}] for [${args.property}] must not exceed 200 characters`;
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
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
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-5-B', {
        datefield2: args.property,
        hourfield2: 'endHour',
        key: KEY,
      });
    },
  })
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @ValidateIf(o => o.endHour !== null || o.endDate !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOEndHour.description,
    example: propertyMetadata.monitorFormulaDTOEndHour.example,
    name: propertyMetadata.monitorFormulaDTOEndHour.fieldLabels.value,
  })
  @IsInt()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FORMULA-5-A', {
        hourfield2: args.property,
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
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
      return CheckCatalogService.formatResultMessage('FORMULA-5-C', {
        datefield2: 'endDate',
        hourfield2: 'endHour',
        datefield1: 'beginDate',
        hourfield1: 'beginHour',
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
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
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOUpdateDate.description,
    example: propertyMetadata.monitorFormulaDTOUpdateDate.example,
    name: propertyMetadata.monitorFormulaDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOActive.description,
    example: propertyMetadata.monitorFormulaDTOActive.example,
    name: propertyMetadata.monitorFormulaDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
