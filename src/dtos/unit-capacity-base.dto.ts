import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import {
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';

export class UnitCapacityBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity
        .description,
    example:
      propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity.example,
    name:
      propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity.fieldLabels
        .value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-999999.9, 999999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  maximumHourlyHeatInputCapacity: number;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOBeginDate.description,
    example: propertyMetadata.unitCapacityDTOBeginDate.example,
    name: propertyMetadata.unitCapacityDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOEndDate.description,
    example: propertyMetadata.unitCapacityDTOEndDate.example,
    name: propertyMetadata.unitCapacityDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endDate: Date;
}
