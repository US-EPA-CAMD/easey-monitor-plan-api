import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

export class CPMSQualificationBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.cpmsQualificationDTOQualificationDataYear.description,
    example: propertyMetadata.cpmsQualificationDTOQualificationDataYear.example,
    name:
      propertyMetadata.cpmsQualificationDTOQualificationDataYear.fieldLabels
        .value,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInRange(1900, currentDateTime().getFullYear(), {
    message: (args: ValidationArguments) => {
      return `You reported an invalid ${args.property} of ${
        args.value
      } in CPMS Qualification record. The value needs to between 1900 and ${currentDateTime().getFullYear()}`;
    },
  })
  qualificationDataYear: number;

  @ApiProperty({
    description:
      propertyMetadata.cpmsQualificationDTOStackTestNumber.description,
    example: propertyMetadata.cpmsQualificationDTOStackTestNumber.example,
    name:
      propertyMetadata.cpmsQualificationDTOStackTestNumber.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsString()
  stackTestNumber: string;

  @ApiProperty({
    description:
      propertyMetadata.cpmsQualificationDTOOperatingLimit.description,
    example: propertyMetadata.cpmsQualificationDTOOperatingLimit.example,
    name: propertyMetadata.cpmsQualificationDTOOperatingLimit.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value for ${args.value} in the Qualification CPMS record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value for ${args.value} in the Qualification CPMS record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  operatingLimit: number;
}

export class CPMSQualificationDTO extends CPMSQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.cpmsQualificationDTOId.description,
    example: propertyMetadata.cpmsQualificationDTOId.example,
    name: propertyMetadata.cpmsQualificationDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.cpmsQualificationDTOQualificationId.description,
    example: propertyMetadata.cpmsQualificationDTOQualificationId.example,
    name:
      propertyMetadata.cpmsQualificationDTOQualificationId.fieldLabels.value,
  })
  @IsString()
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.cpmsQualificationDTOUserId.description,
    example: propertyMetadata.cpmsQualificationDTOUserId.example,
    name: propertyMetadata.cpmsQualificationDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.cpmsQualificationDTOAddDate.description,
    example: propertyMetadata.cpmsQualificationDTOAddDate.example,
    name: propertyMetadata.cpmsQualificationDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.cpmsQualificationDTOUpdateDate.description,
    example: propertyMetadata.cpmsQualificationDTOUpdateDate.example,
    name: propertyMetadata.cpmsQualificationDTOUpdateDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  updateDate: string;
}
