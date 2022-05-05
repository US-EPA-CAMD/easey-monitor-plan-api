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

export class UnitCapacityDTO extends UnitCapacityBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOId.description,
    example: propertyMetadata.unitCapacityDTOId.example,
    name: propertyMetadata.unitCapacityDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUnitId.description,
    example: propertyMetadata.unitCapacityDTOUnitId.example,
    name: propertyMetadata.unitCapacityDTOUnitId.fieldLabels.value,
  })
  unitRecordId: number;

  @ApiProperty({
    description: propertyMetadata.commercialOperationDate.description,
    example: propertyMetadata.commercialOperationDate.example,
    name: propertyMetadata.commercialOperationDate.fieldLabels.value,
  })
  commercialOperationDate: Date;

  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value,
  })
  operationDate: Date;

  boilerTurbineType: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOBeginDate.description,
    example: propertyMetadata.unitCapacityDTOBeginDate.example,
    name: propertyMetadata.unitCapacityDTOBeginDate.fieldLabels.value,
  })
  boilerTurbineBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOEndDate.description,
    example: propertyMetadata.unitCapacityDTOEndDate.example,
    name: propertyMetadata.unitCapacityDTOEndDate.fieldLabels.value,
  })
  boilerTurbineEndDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUserId.description,
    example: propertyMetadata.unitCapacityDTOUserId.example,
    name: propertyMetadata.unitCapacityDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOAddDate.description,
    example: propertyMetadata.unitCapacityDTOAddDate.example,
    name: propertyMetadata.unitCapacityDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUpdateDate.description,
    example: propertyMetadata.unitCapacityDTOUpdateDate.example,
    name: propertyMetadata.unitCapacityDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOActive.description,
    example: propertyMetadata.unitCapacityDTOActive.example,
    name: propertyMetadata.unitCapacityDTOActive.fieldLabels.value,
  })
  active: boolean;
}
