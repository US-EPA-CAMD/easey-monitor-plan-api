import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsSemVer,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';

export class LMEQualificationBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.lMEQualificationDTOQualificationDataYear.description,
    example: propertyMetadata.lMEQualificationDTOQualificationDataYear.example,
    name:
      propertyMetadata.lMEQualificationDTOQualificationDataYear.fieldLabels
        .value,
  })
  @MatchesRegEx('^(19|20)([0-9]{2})$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALLME-FATAL-A] The value for ${args.value} in the Qualification LME record ${args.property} is not formatted properly`;
    },
  })
  @IsNumber()
  qualificationDataYear: number;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOOperatingHours.description,
    example: propertyMetadata.lMEQualificationDTOOperatingHours.example,
    name: propertyMetadata.lMEQualificationDTOOperatingHours.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALLME-FATAL-A] The value for ${args.value} in the Qualification LME record ${args.property} must be numeric, no decimals`;
      },
    },
  )
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
        return `${args.property} [QUALLME-FATAL-A] The value for ${args.value} in the Qualification LME record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-999.9, 999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALLME-FATAL-A] The value for ${args.value} in the Qualification LME record ${args.property} must be within the range of -999.9 and 999.9`;
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
        return `${args.property} [QUALLME-FATAL-A] The value for ${args.value} in the Qualification LME record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-999.9, 999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALLME-FATAL-A] The value for ${args.value} in the Qualification LME record ${args.property} must be within the range of -999.9 and 999.9`;
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
