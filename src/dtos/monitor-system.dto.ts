import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { SystemComponentBaseDTO } from './system-component.dto';
import { SystemFuelFlowBaseDTO } from './system-fuel-flow.dto';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class MonitorSystemBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.monitorSystemDTOMonitoringSystemId.description,
    example: propertyMetadata.monitorSystemDTOMonitoringSystemId.example,
    name: propertyMetadata.monitorSystemDTOMonitoringSystemId.fieldLabels.value,
  })
  @IsNotEmpty()
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSTEM-FATAL-A] The value for ${args.value} in the Monitoring System record ${args.property} is not formatted properly`;
    },
  })
  monitoringSystemId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOSystemTypeCode.description,
    example: propertyMetadata.monitorSystemDTOSystemTypeCode.example,
    name: propertyMetadata.monitorSystemDTOSystemTypeCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    `SELECT sys_type_cd as "value" FROM camdecmpsmd.system_type_code`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSTEM-FATAL-B] The value for ${args.value} in the Monitoring System record ${args.property} is invalid`;
      },
    },
  )
  systemTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorSystemDTOSystemDesignationCode.description,
    example: propertyMetadata.monitorSystemDTOSystemDesignationCode.example,
    name:
      propertyMetadata.monitorSystemDTOSystemDesignationCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    `SELECT sys_designation_cd as "value" FROM camdecmpsmd.system_designation_code`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSTEM-FATAL-B] The value for ${args.value} in the Monitoring System record ${args.property} is invalid`;
      },
    },
  )
  systemDesignationCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOFuelCode.description,
    example: propertyMetadata.monitorSystemDTOFuelCode.example,
    name: propertyMetadata.monitorSystemDTOFuelCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    `SELECT fuel_cd as "value" FROM camdecmpsmd.fuel_code where fuel_group_cd not in ('OTHER','COAL')`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSTEM-FATAL-B] The value for ${args.value} in the Monitoring System record ${args.property} is invalid`;
      },
    },
  )
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOBeginDate.description,
    example: propertyMetadata.monitorSystemDTOBeginDate.example,
    name: propertyMetadata.monitorSystemDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSTEM-FATAL-A] The value for ${args.value} in the Monitoring System record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @IsOptional()
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOEndDate.description,
    example: propertyMetadata.monitorSystemDTOEndDate.example,
    name: propertyMetadata.monitorSystemDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSTEM-FATAL-A] The value for ${args.value} in the Monitoring System record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOBeginHour.description,
    example: propertyMetadata.monitorSystemDTOBeginHour.example,
    name: propertyMetadata.monitorSystemDTOBeginHour.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSTEM-FATAL-A] The value for ${args.value} in the Monitoring System record ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOEndHour.description,
    example: propertyMetadata.monitorSystemDTOEndHour.example,
    name: propertyMetadata.monitorSystemDTOEndHour.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSTEM-FATAL-A] The value for ${args.value} in the Monitoring System record ${args.property} must be within the range of 0 and 23`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endHour: number;

  @ValidateNested()
  @Type(() => SystemComponentBaseDTO)
  components: SystemComponentBaseDTO[];

  @ValidateNested()
  @Type(() => SystemFuelFlowBaseDTO)
  fuelFlows: SystemFuelFlowBaseDTO[];
}

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
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOUpdateDate.description,
    example: propertyMetadata.monitorSystemDTOUpdateDate.example,
    name: propertyMetadata.monitorSystemDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOActive.description,
    example: propertyMetadata.monitorSystemDTOActive.example,
    name: propertyMetadata.monitorSystemDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
