import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsAtMostDigits } from '../import-checks/pipes/is-at-most-digits.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class MonitorAttributeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTODuctIndicator.description,
    example: propertyMetadata.monitorAttributeDTODuctIndicator.example,
    name: propertyMetadata.monitorAttributeDTODuctIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be within the range of 0 and 1`;
    },
  })
  ductIndicator: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOBypassIndicator.description,
    example: propertyMetadata.monitorAttributeDTOBypassIndicator.example,
    name: propertyMetadata.monitorAttributeDTOBypassIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be within the range of 0 and 1`;
    },
  })
  bypassIndicator: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOGroundElevation.description,
    example: propertyMetadata.monitorAttributeDTOGroundElevation.example,
    name: propertyMetadata.monitorAttributeDTOGroundElevation.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsAtMostDigits(5, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be 5 digits or less`;
    },
  })
  groundElevation: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOStackHeight.description,
    example: propertyMetadata.monitorAttributeDTOStackHeight.example,
    name: propertyMetadata.monitorAttributeDTOStackHeight.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsAtMostDigits(4, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be 4 digits or less`;
    },
  })
  stackHeight: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOMaterialCode.description,
    example: propertyMetadata.monitorAttributeDTOMaterialCode.example,
    name: propertyMetadata.monitorAttributeDTOMaterialCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT material_cd as "value" FROM camdecmpsmd.material_code',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [LOCATIONATTR-FATAL-B] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} is invalid`;
      },
    },
  )
  materialCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOShapeCode.description,
    example: propertyMetadata.monitorAttributeDTOShapeCode.example,
    name: propertyMetadata.monitorAttributeDTOShapeCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues('SELECT shape_cd as "value" FROM camdecmpsmd.shape_code', {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-B] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} is invalid`;
    },
  })
  shapeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOCrossAreaFlow.description,
    example: propertyMetadata.monitorAttributeDTOCrossAreaFlow.example,
    name: propertyMetadata.monitorAttributeDTOCrossAreaFlow.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsAtMostDigits(4, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be 4 digits or less`;
    },
  })
  crossAreaFlow: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOCrossAreaStackExit.description,
    example: propertyMetadata.monitorAttributeDTOCrossAreaStackExit.example,
    name:
      propertyMetadata.monitorAttributeDTOCrossAreaStackExit.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsAtMostDigits(4, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be 4 digits or less`;
    },
  })
  crossAreaStackExit: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOBeginDate.description,
    example: propertyMetadata.monitorAttributeDTOBeginDate.example,
    name: propertyMetadata.monitorAttributeDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOEndDate.description,
    example: propertyMetadata.monitorAttributeDTOEndDate.example,
    name: propertyMetadata.monitorAttributeDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [LOCATIONATTR-FATAL-A] The value for ${args.value} in the Monitoring Location Attributes record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  endDate: Date;
}

export class MonitorAttributeDTO extends MonitorAttributeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOId.description,
    example: propertyMetadata.monitorAttributeDTOId.example,
    name: propertyMetadata.monitorAttributeDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOLocationId.description,
    example: propertyMetadata.monitorAttributeDTOLocationId.example,
    name: propertyMetadata.monitorAttributeDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOUserId.description,
    example: propertyMetadata.monitorAttributeDTOUserId.example,
    name: propertyMetadata.monitorAttributeDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOAddDate.description,
    example: propertyMetadata.monitorAttributeDTOAddDate.example,
    name: propertyMetadata.monitorAttributeDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOUpdateDate.description,
    example: propertyMetadata.monitorAttributeDTOUpdateDate.example,
    name: propertyMetadata.monitorAttributeDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOActive.description,
    example: propertyMetadata.monitorAttributeDTOActive.example,
    name: propertyMetadata.monitorAttributeDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
