import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInt, ValidationArguments } from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class UnitControlBaseDTO {
  @ApiProperty({
    description: propertyMetadata.controlEquipParamCode.description,
    example: propertyMetadata.controlEquipParamCode.example,
    name: propertyMetadata.controlEquipParamCode.fieldLabels.value,
  })
  @IsInDbValues(
    `SELECT distinct controlequipparamcode as "value" FROM camdecmpsmd.vw_unitcontrol_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITCONTROL-FATAL-B] The value for ${args.value} in the Unit Control record ${args.property} is invalid`;
      },
    },
  )
  controlEquipParamCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOControlCode.description,
    example: propertyMetadata.unitControlDTOControlCode.example,
    name: propertyMetadata.unitControlDTOControlCode.fieldLabels.value,
  })
  @IsInDbValues(
    `SELECT distinct control_code as "value" FROM camdecmpsmd.vw_unitcontrol_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITCONTROL-FATAL-B] The value for ${args.value} in the Unit Control record ${args.property} is invalid`;
      },
    },
  )
  controlCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOOriginalCode.description,
    example: propertyMetadata.unitControlDTOOriginalCode.example,
    name: propertyMetadata.unitControlDTOOriginalCode.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCONTROL-FATAL-A] The value for ${args.value} in the Unit Control record  ${args.property} must be within the range of 0 and 1`;
    },
  })
  originalCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOInstallDate.description,
    example: propertyMetadata.unitControlDTOInstallDate.example,
    name: propertyMetadata.unitControlDTOInstallDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCONTROL-FATAL-A] The value for ${args.value} in the Unit Control record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  installDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOOptimizationDate.description,
    example: propertyMetadata.unitControlDTOOptimizationDate.example,
    name: propertyMetadata.unitControlDTOOptimizationDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCONTROL-FATAL-A] The value for ${args.value} in the Unit Control record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  optimizationDate: Date;

  @ApiProperty({
    description:
      propertyMetadata.unitControlDTOSeasonalControlsIndicator.description,
    example: propertyMetadata.unitControlDTOSeasonalControlsIndicator.example,
    name:
      propertyMetadata.unitControlDTOSeasonalControlsIndicator.fieldLabels
        .value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCONTROL-FATAL-A] The value for ${args.value} in the Unit Control record  ${args.property} must be within the range of 0 and 1`;
    },
  })
  seasonalControlsIndicator: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTORetireDate.description,
    example: propertyMetadata.unitControlDTORetireDate.example,
    name: propertyMetadata.unitControlDTORetireDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCONTROL-FATAL-A] The value for ${args.value} in the Unit Control record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  retireDate: Date;
}

export class UnitControlDTO extends UnitControlBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitControlDTOId.description,
    example: propertyMetadata.unitControlDTOId.example,
    name: propertyMetadata.unitControlDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUnitId.description,
    example: propertyMetadata.unitControlDTOUnitId.example,
    name: propertyMetadata.unitControlDTOUnitId.fieldLabels.value,
  })
  unitRecordId: number;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUserId.description,
    example: propertyMetadata.unitControlDTOUserId.example,
    name: propertyMetadata.unitControlDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOAddDate.description,
    example: propertyMetadata.unitControlDTOAddDate.example,
    name: propertyMetadata.unitControlDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUpdateDate.description,
    example: propertyMetadata.unitControlDTOUpdateDate.example,
    name: propertyMetadata.unitControlDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOActive.description,
    example: propertyMetadata.unitControlDTOActive.example,
    name: propertyMetadata.unitControlDTOActive.fieldLabels.value,
  })
  active: boolean;
}
