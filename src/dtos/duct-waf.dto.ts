import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { IsAtMostDigits } from '../import-checks/pipes/is-at-most-digits.pipe';

export class DuctWafBaseDTO {
  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafDeterminationDate.description,
    example: propertyMetadata.ductWafDTOWafDeterminationDate.example,
    name: propertyMetadata.ductWafDTOWafDeterminationDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  wafDeterminationDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafBeginDate.description,
    example: propertyMetadata.ductWafDTOWafBeginDate.example,
    name: propertyMetadata.ductWafDTOWafBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  wafBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafBeginHour.description,
    example: propertyMetadata.ductWafDTOWafBeginHour.example,
    name: propertyMetadata.ductWafDTOWafBeginHour.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be within the range of 0 and 23`;
    },
  })
  wafBeginHour: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafMethodCode.description,
    example: propertyMetadata.ductWafDTOWafMethodCode.example,
    name: propertyMetadata.ductWafDTOWafMethodCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT waf_method_cd as "value" FROM camdecmpsmd.waf_method_code',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [RECTDUCTWAF-FATAL-B] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} is invalid`;
      },
    },
  )
  wafMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafValue.description,
    example: propertyMetadata.ductWafDTOWafValue.example,
    name: propertyMetadata.ductWafDTOWafValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 4 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} is allowed only 4 decimal place`;
      },
    },
  )
  @IsInRange(-99.9999, 99.9999, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be within the range of -99.9999 and 99.9999`;
    },
  })
  wafValue: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTestRuns.description,
    example: propertyMetadata.ductWafDTONumberOfTestRuns.example,
    name: propertyMetadata.ductWafDTONumberOfTestRuns.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(2, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be 2 digits or less`;
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
  @IsInt()
  @IsAtMostDigits(2, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be 2 digits or less`;
    },
  })
  numberOfTraversePointsWaf: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTestPorts.description,
    example: propertyMetadata.ductWafDTONumberOfTestPorts.example,
    name: propertyMetadata.ductWafDTONumberOfTestPorts.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(2, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be 2 digits or less`;
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
  @IsInt()
  @IsAtMostDigits(2, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be 2 digits or less`;
    },
  })
  numberOfTraversePointsRef: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTODuctWidth.description,
    example: propertyMetadata.ductWafDTODuctWidth.example,
    name: propertyMetadata.ductWafDTODuctWidth.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} is allowed only 1 decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  ductWidth: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTODuctDepth.description,
    example: propertyMetadata.ductWafDTODuctDepth.example,
    name: propertyMetadata.ductWafDTODuctDepth.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} is allowed only 1 decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  ductDepth: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafEndDate.description,
    example: propertyMetadata.ductWafDTOWafEndDate.example,
    name: propertyMetadata.ductWafDTOWafEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.wafEndHour !== null)
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  wafEndDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafEndHour.description,
    example: propertyMetadata.ductWafDTOWafEndHour.example,
    name: propertyMetadata.ductWafDTOWafEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.wafEndDate !== null)
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [RECTDUCTWAF-FATAL-A] The value for ${args.value} in the Rectangular Duct Waf record ${args.property} must be within the range of 0 and 23`;
    },
  })
  wafEndHour: number;

  active: boolean;
}

export class DuctWafDTO extends DuctWafBaseDTO {
  @ApiProperty({
    description: propertyMetadata.ductWafDTOId.description,
    example: propertyMetadata.ductWafDTOId.example,
    name: propertyMetadata.ductWafDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOLocationId.description,
    example: propertyMetadata.ductWafDTOLocationId.example,
    name: propertyMetadata.ductWafDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOUserId.description,
    example: propertyMetadata.ductWafDTOUserId.example,
    name: propertyMetadata.ductWafDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOAddDate.description,
    example: propertyMetadata.ductWafDTOAddDate.example,
    name: propertyMetadata.ductWafDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOUpdateDate.description,
    example: propertyMetadata.ductWafDTOUpdateDate.example,
    name: propertyMetadata.ductWafDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;
}
