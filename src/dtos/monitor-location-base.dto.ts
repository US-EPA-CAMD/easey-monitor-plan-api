import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInt, ValidationArguments } from 'class-validator';

export class MonitorLocationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOUnitId.description,
    example: propertyMetadata.monitorLocationDTOUnitId.example,
    name: propertyMetadata.monitorLocationDTOUnitId.fieldLabels.value,
  })
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOStackPipeId.description,
    example: propertyMetadata.monitorLocationDTOStackPipeId.example,
    name: propertyMetadata.monitorLocationDTOStackPipeId.fieldLabels.value,
  })
  stackPipeId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOActiveDate.description,
    example: propertyMetadata.monitorLocationDTOActiveDate.example,
    name: propertyMetadata.monitorLocationDTOActiveDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  activeDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTORetireDate.description,
    example: propertyMetadata.monitorLocationDTORetireDate.example,
    name: propertyMetadata.monitorLocationDTORetireDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  retireDate: Date;

  @ApiProperty({
    description:
      propertyMetadata.monitorLocationDTONonLoadBasedIndicator.description,
    example: propertyMetadata.monitorLocationDTONonLoadBasedIndicator.example,
    name:
      propertyMetadata.monitorLocationDTONonLoadBasedIndicator.fieldLabels
        .value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNIT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  nonLoadBasedIndicator: number;
}
