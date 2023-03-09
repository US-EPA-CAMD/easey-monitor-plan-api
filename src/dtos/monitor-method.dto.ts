import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
export class MonitorMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOParameterCode.description,
    example: propertyMetadata.monitorMethodDTOParameterCode.example,
    name: propertyMetadata.monitorMethodDTOParameterCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    `SELECT distinct parameter_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [METHOD-FATAL-B] The value for ${args.value} in the Monitoring Method record ${args.property} is invalid`;
      },
    },
  )
  parameterCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOMonitoringMethodCode.description,
    example: propertyMetadata.monitorMethodDTOMonitoringMethodCode.example,
    name:
      propertyMetadata.monitorMethodDTOMonitoringMethodCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    `SELECT distinct method_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [METHOD-FATAL-B] The value for ${args.value} in the Monitoring Method record ${args.property} is invalid`;
      },
    },
  )
  monitoringMethodCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOSubstituteDataCode.description,
    example: propertyMetadata.monitorMethodDTOSubstituteDataCode.example,
    name: propertyMetadata.monitorMethodDTOSubstituteDataCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    `SELECT distinct substitute_data_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [METHOD-FATAL-B] The value for ${args.value} in the Monitoring Method record ${args.property} is invalid`;
      },
    },
  )
  substituteDataCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOBypassApproachCode.description,
    example: propertyMetadata.monitorMethodDTOBypassApproachCode.example,
    name: propertyMetadata.monitorMethodDTOBypassApproachCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    `SELECT distinct bypass_approach_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [METHOD-FATAL-B] The value for ${args.value} in the Monitoring Method record ${args.property} is invalid`;
      },
    },
  )
  bypassApproachCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOBeginDate.description,
    example: propertyMetadata.monitorMethodDTOBeginDate.example,
    name: propertyMetadata.monitorMethodDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [METHOD-FATAL-A] The value for ${args.value} in the Monitoring Method record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOBeginHour.description,
    example: propertyMetadata.monitorMethodDTOBeginHour.example,
    name: propertyMetadata.monitorMethodDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [METHOD-FATAL-A] The value for ${args.value} in the Monitoring Method record ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOEndDate.description,
    example: propertyMetadata.monitorMethodDTOEndDate.example,
    name: propertyMetadata.monitorMethodDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [METHOD-FATAL-A] The value for ${args.value} in the Monitoring Method record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOEndHour.description,
    example: propertyMetadata.monitorMethodDTOEndHour.example,
    name: propertyMetadata.monitorMethodDTOEndHour.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [METHOD-FATAL-A] The value for ${args.value} in the Monitoring Method record ${args.property} must be within the range of 0 and 23`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}

export class MonitorMethodDTO extends MonitorMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOId.description,
    example: propertyMetadata.monitorMethodDTOId.example,
    name: propertyMetadata.monitorMethodDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOLocationId.description,
    example: propertyMetadata.monitorMethodDTOLocationId.example,
    name: propertyMetadata.monitorMethodDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOUserId.description,
    example: propertyMetadata.monitorMethodDTOUserId.example,
    name: propertyMetadata.monitorMethodDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOAddDate.description,
    example: propertyMetadata.monitorMethodDTOAddDate.example,
    name: propertyMetadata.monitorMethodDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOUpdateDate.description,
    example: propertyMetadata.monitorMethodDTOUpdateDate.example,
    name: propertyMetadata.monitorMethodDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOActive.description,
    example: propertyMetadata.monitorMethodDTOActive.example,
    name: propertyMetadata.monitorMethodDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
