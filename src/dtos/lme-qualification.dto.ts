import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

const KEY = 'Monitor Qualification LME';

export class LMEQualificationBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.lMEQualificationDTOQualificationDataYear.description,
    example: propertyMetadata.lMEQualificationDTOQualificationDataYear.example,
    name:
      propertyMetadata.lMEQualificationDTOQualificationDataYear.fieldLabels
        .value,
  })
  @IsInRange(1900, 2099, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 1900 and 2099.`;
    },
  })
  @IsInt()
  qualificationDataYear: number;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOOperatingHours.description,
    example: propertyMetadata.lMEQualificationDTOOperatingHours.example,
    name: propertyMetadata.lMEQualificationDTOOperatingHours.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 8784, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 8784.`;
    },
  })
  operatingHours: number;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOSo2Tons.description,
    example: propertyMetadata.lMEQualificationDTOSo2Tons.example,
    name: propertyMetadata.lMEQualificationDTOSo2Tons.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999.9 for [${KEY}].`;
    },
  })
  so2Tons: number;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTONoxTons.description,
    example: propertyMetadata.lMEQualificationDTONoxTons.example,
    name: propertyMetadata.lMEQualificationDTONoxTons.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999.9 for [${KEY}].`;
    },
  })
  noxTons: number;
}

export class LMEQualificationDTO extends LMEQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOId.description,
    example: propertyMetadata.lMEQualificationDTOId.example,
    name: propertyMetadata.lMEQualificationDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.lMEQualificationDTOQualificationId.description,
    example: propertyMetadata.lMEQualificationDTOQualificationId.example,
    name: propertyMetadata.lMEQualificationDTOQualificationId.fieldLabels.value,
  })
  @IsString()
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOUserId.description,
    example: propertyMetadata.lMEQualificationDTOUserId.example,
    name: propertyMetadata.lMEQualificationDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOAddDate.description,
    example: propertyMetadata.lMEQualificationDTOAddDate.example,
    name: propertyMetadata.lMEQualificationDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOUpdateDate.description,
    example: propertyMetadata.lMEQualificationDTOUpdateDate.example,
    name: propertyMetadata.lMEQualificationDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;
}
