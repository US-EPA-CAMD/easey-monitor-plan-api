import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  SystemComponentBaseDTO,
  SystemComponentDTO,
} from './system-component.dto';
import {
  SystemFuelFlowBaseDTO,
  SystemFuelFlowDTO,
} from './system-fuel-flow.dto';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
} from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  DATE_FORMAT,
  MAXIMUM_FUTURE_DATE,
  MAX_HOUR,
  MINIMUM_DATE,
  MIN_HOUR,
} from '../utilities/constants';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import { SystemTypeCode } from '../entities/system-type-code.entity';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Monitor System';

export class MonitorSystemBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.monitorSystemDTOMonitoringSystemId.description,
    example: propertyMetadata.monitorSystemDTOMonitoringSystemId.example,
    name: propertyMetadata.monitorSystemDTOMonitoringSystemId.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-7-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-7-B', {
        iD: args.value,
      });
    },
  })
  monitoringSystemId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOSystemTypeCode.description,
    example: propertyMetadata.monitorSystemDTOSystemTypeCode.example,
    name: propertyMetadata.monitorSystemDTOSystemTypeCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-8-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(SystemTypeCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-8-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  systemTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorSystemDTOSystemDesignationCode.description,
    example: propertyMetadata.monitorSystemDTOSystemDesignationCode.example,
    name:
      propertyMetadata.monitorSystemDTOSystemDesignationCode.fieldLabels.value,
  })
  @IsInDbValues(
    `SELECT sys_designation_cd as "value" FROM camdecmpsmd.system_designation_code`,
    {
      message: (args: ValidationArguments) => {
        return `The value for ${args.value} in the Monitoring System record ${args.property} is invalid`;
      },
    },
  )
  systemDesignationCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOFuelCode.description,
    example: propertyMetadata.monitorSystemDTOFuelCode.example,
    name: propertyMetadata.monitorSystemDTOFuelCode.fieldLabels.value,
  })
  @IsInDbValues(
    `SELECT fuel_cd as "value" FROM camdecmpsmd.fuel_code where fuel_group_cd not in ('OTHER','COAL')`,
    {
      message: (args: ValidationArguments) => {
        return `The value for ${args.value} in the Monitoring System record ${args.property} is invalid`;
      },
    },
  )
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOBeginDate.description,
    example: propertyMetadata.monitorSystemDTOBeginDate.example,
    name: propertyMetadata.monitorSystemDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-1-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-1-B', {
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
    description: propertyMetadata.monitorSystemDTOEndDate.description,
    example: propertyMetadata.monitorSystemDTOEndDate.example,
    name: propertyMetadata.monitorSystemDTOEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-5-B', {
        datefield2: args.property,
        hourfield2: 'endHour',
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-3-A', {
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
    description: propertyMetadata.monitorSystemDTOBeginHour.description,
    example: propertyMetadata.monitorSystemDTOBeginHour.example,
    name: propertyMetadata.monitorSystemDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-2-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-2-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOEndHour.description,
    example: propertyMetadata.monitorSystemDTOEndHour.example,
    name: propertyMetadata.monitorSystemDTOEndHour.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-5-A', {
        hourfield2: args.property,
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-4-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SYSTEM-5-C', {
        datefield2: 'endDate',
        hourfield2: 'endHour',
        datefield1: 'beginDate',
        hourfield1: 'beginHour',
        key: KEY,
      });
    },
  })
  endHour: number;

  @ValidateNested({ each: true })
  @Type(() => SystemComponentBaseDTO)
  components: SystemComponentBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => SystemFuelFlowBaseDTO)
  fuelFlows: SystemFuelFlowBaseDTO[];
}

export class UpdateMonitorSystemDTO extends MonitorSystemBaseDTO {}

export class MonitorSystemDTO extends MonitorSystemBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOId.description,
    example: propertyMetadata.monitorSystemDTOId.example,
    name: propertyMetadata.monitorSystemDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOLocationId.description,
    example: propertyMetadata.monitorSystemDTOLocationId.example,
    name: propertyMetadata.monitorSystemDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOUserId.description,
    example: propertyMetadata.monitorSystemDTOUserId.example,
    name: propertyMetadata.monitorSystemDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOAddDate.description,
    example: propertyMetadata.monitorSystemDTOAddDate.example,
    name: propertyMetadata.monitorSystemDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOUpdateDate.description,
    example: propertyMetadata.monitorSystemDTOUpdateDate.example,
    name: propertyMetadata.monitorSystemDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ValidateNested({ each: true })
  @Type(() => SystemComponentDTO)
  components: SystemComponentDTO[];

  @ValidateNested({ each: true })
  @Type(() => SystemFuelFlowDTO)
  fuelFlows: SystemFuelFlowDTO[];

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOActive.description,
    example: propertyMetadata.monitorSystemDTOActive.example,
    name: propertyMetadata.monitorSystemDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
