import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  DATE_FORMAT,
  MAX_HOUR,
  MAXIMUM_FUTURE_DATE,
  MIN_HOUR,
} from '../utilities/constants';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';

const KEY = 'Rectangular Duct Waf';
const MINIMUM_DATE = '2004-01-01';
const CURRENT_DATE = () => {
  return new Date().toISOString().split('T')[0];
};

export class DuctWafBaseDTO {
  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafDeterminationDate.description,
    example: propertyMetadata.ductWafDTOWafDeterminationDate.example,
    name: propertyMetadata.ductWafDTOWafDeterminationDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must be a valid ISO date format [dateFormat]`,
        {
          fieldname: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  wafDeterminationDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafBeginDate.description,
    example: propertyMetadata.ductWafDTOWafBeginDate.example,
    name: propertyMetadata.ductWafDTOWafBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-82-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, CURRENT_DATE(), {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-82-B', {
        Fieldname: args.property,
        Date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must be a valid ISO date format [dateFormat]`,
        {
          fieldname: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  wafBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafBeginHour.description,
    example: propertyMetadata.ductWafDTOWafBeginHour.example,
    name: propertyMetadata.ductWafDTOWafBeginHour.fieldLabels.value,
  })
  @IsInt()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-83-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-83-B', {
        Fieldname: args.property,
        Hour: args.value,
        key: KEY,
      });
    },
  })
  wafBeginHour: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafMethodCode.description,
    example: propertyMetadata.ductWafDTOWafMethodCode.example,
    name: propertyMetadata.ductWafDTOWafMethodCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT waf_method_cd as "value" FROM camdecmpsmd.waf_method_code',
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
  wafMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafValue.description,
    example: propertyMetadata.ductWafDTOWafValue.example,
    name: propertyMetadata.ductWafDTOWafValue.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-80-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber(
    { maxDecimalPlaces: 4 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 4 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(
    0,
    99.9999,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('DEFAULT-80-D', {
          fieldname: args.property,
          value: args.value,
          key: KEY,
        });
      },
    },
    false,
    false,
  )
  wafValue: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTestRuns.description,
    example: propertyMetadata.ductWafDTONumberOfTestRuns.example,
    name: propertyMetadata.ductWafDTONumberOfTestRuns.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(1, 99, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must be in range 1 and 99`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  numberOfTestRuns: number;

  @ApiProperty({
    description:
      propertyMetadata.ductWafDTONumberOfTraversePointsWaf.description,
    example: propertyMetadata.ductWafDTONumberOfTraversePointsWaf.example,
    name:
      propertyMetadata.ductWafDTONumberOfTraversePointsWaf.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(12, 99, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must be in range 12 and 99`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  numberOfTraversePointsWaf: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTestPorts.description,
    example: propertyMetadata.ductWafDTONumberOfTestPorts.example,
    name: propertyMetadata.ductWafDTONumberOfTestPorts.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(1, 99, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must be in range 1 and 99`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  numberOfTestPorts: number;

  @ApiProperty({
    description:
      propertyMetadata.ductWafDTONumberOfTraversePointsRef.description,
    example: propertyMetadata.ductWafDTONumberOfTraversePointsRef.example,
    name:
      propertyMetadata.ductWafDTONumberOfTraversePointsRef.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(12, 99, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must be in range 12 and 99`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  numberOfTraversePointsRef: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTODuctWidth.description,
    example: propertyMetadata.ductWafDTODuctWidth.example,
    name: propertyMetadata.ductWafDTODuctWidth.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-78-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 9999.9, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] is in range 0 and 9999.9 and is allowed only 1 decimal place`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for [${KEY}]`;
      },
    },
  )
  @IsPositive({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-78-B', {
        fieldname: args.property,
        value: args.value,
        key: KEY,
      });
    },
  })
  ductWidth: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTODuctDepth.description,
    example: propertyMetadata.ductWafDTODuctDepth.example,
    name: propertyMetadata.ductWafDTODuctDepth.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-79-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 9999.9, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] is in range 0 and 9999.9 and is allowed only 1 decimal place`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for [${KEY}]`;
      },
    },
  )
  @IsPositive({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-79-B', {
        fieldname: args.property,
        value: args.value,
        key: KEY,
      });
    },
  })
  ductDepth: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafEndDate.description,
    example: propertyMetadata.ductWafDTOWafEndDate.example,
    name: propertyMetadata.ductWafDTOWafEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.wafEndDate !== null || o.wafEndHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You reported [wafEndHour] but did not report an [wafEndDate] for [[${KEY}]].`;
    },
  })
  @IsInDateRange(MINIMUM_DATE, CURRENT_DATE(), {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-84-A', {
        Fieldname: args.property,
        Date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] for [key] must be a valid ISO date format [dateFormat]`,
        {
          fieldname: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  wafEndDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafEndHour.description,
    example: propertyMetadata.ductWafDTOWafEndHour.example,
    name: propertyMetadata.ductWafDTOWafEndHour.fieldLabels.value,
  })
  @ValidateIf(o => o.wafEndHour !== null || o.wafEndDate !== null)
  @IsInt()
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('DEFAULT-85-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You reported [wafEndDate] but did not report an [wafEndHour] for [[${KEY}]].`;
    },
  })
  wafEndHour: number;
}

export class DuctWafDTO extends DuctWafBaseDTO {
  @ApiProperty({
    description: propertyMetadata.ductWafDTOId.description,
    example: propertyMetadata.ductWafDTOId.example,
    name: propertyMetadata.ductWafDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOLocationId.description,
    example: propertyMetadata.ductWafDTOLocationId.example,
    name: propertyMetadata.ductWafDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOUserId.description,
    example: propertyMetadata.ductWafDTOUserId.example,
    name: propertyMetadata.ductWafDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOAddDate.description,
    example: propertyMetadata.ductWafDTOAddDate.example,
    name: propertyMetadata.ductWafDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOUpdateDate.description,
    example: propertyMetadata.ductWafDTOUpdateDate.example,
    name: propertyMetadata.ductWafDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  // TODO: add ApiProperty
  @IsBoolean()
  active: boolean;
}
