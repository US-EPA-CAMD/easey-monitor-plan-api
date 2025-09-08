import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserCheckOutBaseDTO {
  @ApiProperty({
    description: propertyMetadata.userCheckOutDTO.facId.description,
    example: propertyMetadata.userCheckOutDTO.facId.example,
    name: propertyMetadata.userCheckOutDTO.facId.fieldLabels.value,
  })
  @IsNumber()
  facId: number;

  @ApiProperty({
    description: propertyMetadata.userCheckOutDTO.checkedOutOn.description,
    example: propertyMetadata.userCheckOutDTO.checkedOutOn.example,
    name: propertyMetadata.userCheckOutDTO.checkedOutOn.fieldLabels.value,
  })
  @IsDateString()
  checkedOutOn: string;

  @ApiProperty({
    description: propertyMetadata.userCheckOutDTO.checkedOutBy.description,
    example: propertyMetadata.userCheckOutDTO.checkedOutBy.example,
    name: propertyMetadata.userCheckOutDTO.checkedOutBy.fieldLabels.value,
  })
  @IsString()
  checkedOutBy: string;

  @ApiProperty({
    description: propertyMetadata.userCheckOutDTO.lastActivity.description,
    example: propertyMetadata.userCheckOutDTO.lastActivity.example,
    name: propertyMetadata.userCheckOutDTO.lastActivity.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  lastActivity: string;
}

export class UserCheckOutDTO extends UserCheckOutBaseDTO {
  @ApiProperty({
    description: propertyMetadata.userCheckOutDTO.monPlanId.description,
    example: propertyMetadata.userCheckOutDTO.monPlanId.example,
    name: propertyMetadata.userCheckOutDTO.monPlanId.fieldLabels.value,
  })
  @IsString()
  monPlanId: string;
}
