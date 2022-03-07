import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInt, ValidationArguments } from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

export class UnitControlBaseDTO {
  @ApiProperty({
    description: propertyMetadata.controlEquipParamCode.description,
    example: propertyMetadata.controlEquipParamCode.example,
    name: propertyMetadata.controlEquipParamCode.fieldLabels.value,
  })
  controlEquipParamCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOControlCode.description,
    example: propertyMetadata.unitControlDTOControlCode.example,
    name: propertyMetadata.unitControlDTOControlCode.fieldLabels.value,
  })
  controlCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOOriginalCode.description,
    example: propertyMetadata.unitControlDTOOriginalCode.example,
    name: propertyMetadata.unitControlDTOOriginalCode.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  originalCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOInstallDate.description,
    example: propertyMetadata.unitControlDTOInstallDate.example,
    name: propertyMetadata.unitControlDTOInstallDate.fieldLabels.value,
  })
  installDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOOptimizationDate.description,
    example: propertyMetadata.unitControlDTOOptimizationDate.example,
    name: propertyMetadata.unitControlDTOOptimizationDate.fieldLabels.value,
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
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  seasonalControlsIndicator: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTORetireDate.description,
    example: propertyMetadata.unitControlDTORetireDate.example,
    name: propertyMetadata.unitControlDTORetireDate.fieldLabels.value,
  })
  retireDate: Date;
}
