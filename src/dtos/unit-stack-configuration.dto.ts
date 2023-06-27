import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';

export class UnitStackConfigurationBaseDTO {
  @IsString()
  @MatchesRegEx('^[A-Za-z0-9*#-]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITSTACKCONFIG-FATAL-A] The value : ${args.value} for ${args.property} must be match the RegEx: [A-Za-z0-9*#-]{1,6}`;
    },
  })
  unitId: string;

  @IsString()
  @MatchesRegEx('^(C|c|M|m|X|x)(S|s|P|p)[A-z0-9 -]{1,4}$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITSTACKCONFIG-FATAL-A] The value : ${args.value} for ${args.property} must be match the RegEx: (C|c|M|m|X|x)(S|s|P|p)[A-z0-9 -]{1,4}`;
    },
  })
  stackPipeId: string;

  @ApiProperty({
    description:
      propertyMetadata.unitStackConfigurationDTOBeginDate.description,
    example: propertyMetadata.unitStackConfigurationDTOBeginDate.example,
    name: propertyMetadata.unitStackConfigurationDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITSTACKCONFIG-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOEndDate.description,
    example: propertyMetadata.unitStackConfigurationDTOEndDate.example,
    name: propertyMetadata.unitStackConfigurationDTOEndDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITSTACKCONFIG-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  endDate: Date;
}

export class UnitStackConfigurationDTO extends UnitStackConfigurationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOId.description,
    example: propertyMetadata.unitStackConfigurationDTOId.example,
    name: propertyMetadata.unitStackConfigurationDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUnitId.description,
    example: propertyMetadata.unitStackConfigurationDTOUnitId.example,
  })
  @IsNumber()
  unitRecordId: number;

  @ApiProperty({
    description:
      propertyMetadata.unitStackConfigurationDTOStackPipeId.description,
    example: propertyMetadata.unitStackConfigurationDTOStackPipeId.example,
  })
  @IsString()
  stackPipeRecordId: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUserId.description,
    example: propertyMetadata.unitStackConfigurationDTOUserId.example,
    name: propertyMetadata.unitStackConfigurationDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOAddDate.description,
    example: propertyMetadata.unitStackConfigurationDTOAddDate.example,
    name: propertyMetadata.unitStackConfigurationDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description:
      propertyMetadata.unitStackConfigurationDTOUpdateDate.description,
    example: propertyMetadata.unitStackConfigurationDTOUpdateDate.example,
    name:
      propertyMetadata.unitStackConfigurationDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOActive.description,
    example: propertyMetadata.unitStackConfigurationDTOActive.example,
    name: propertyMetadata.unitStackConfigurationDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
