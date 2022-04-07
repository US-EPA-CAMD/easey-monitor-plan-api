import { IsNotEmpty, IsNumber, ValidateIf, ValidationArguments } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { ComponentBaseDTO } from './component-base.dto';
import { IsInRange } from '@us-epa-camd/easey-common/pipes/is-in-range.pipe';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';

export class SystemComponentBaseDTO extends ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginDate.description,
    example: propertyMetadata.systemComponentDTOBeginDate.example,
    name: propertyMetadata.systemComponentDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginHour.description,
    example: propertyMetadata.systemComponentDTOBeginHour.example,
    name: propertyMetadata.systemComponentDTOBeginHour.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} is allowed only without decimal place`;
      },
    },
  )
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndDate.description,
    example: propertyMetadata.systemComponentDTOEndDate.example,
    name: propertyMetadata.systemComponentDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndHour.description,
    example: propertyMetadata.systemComponentDTOEndHour.example,
    name: propertyMetadata.systemComponentDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} is allowed only without decimal place`;
      },
    },
  )
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be within the range of 0 and 23`;
    },
  })
  endHour: number;
}
