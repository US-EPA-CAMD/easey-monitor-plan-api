import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsString, ValidationArguments } from 'class-validator';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import { UnitStackConfigurationBaseDTO } from './unit-stack-configuration-base.dto';

export class UnitStackConfigurationDTO extends UnitStackConfigurationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOId.description,
    example: propertyMetadata.unitStackConfigurationDTOId.example,
    name: propertyMetadata.unitStackConfigurationDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUserId.description,
    example: propertyMetadata.unitStackConfigurationDTOUserId.example,
    name: propertyMetadata.unitStackConfigurationDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOAddDate.description,
    example: propertyMetadata.unitStackConfigurationDTOAddDate.example,
    name: propertyMetadata.unitStackConfigurationDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description:
      propertyMetadata.unitStackConfigurationDTOUpdateDate.description,
    example: propertyMetadata.unitStackConfigurationDTOUpdateDate.example,
    name:
      propertyMetadata.unitStackConfigurationDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOActive.description,
    example: propertyMetadata.unitStackConfigurationDTOActive.example,
    name: propertyMetadata.unitStackConfigurationDTOActive.fieldLabels.value,
  })
  active: boolean;

  @IsString()
  @MatchesRegEx('^(C|c|M|m|X|x)(S|s|P|p)[A-z0-9 -]{1,4}$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITSTACKCONFIG-FATAL-A] The value : ${args.value} for ${args.property} must be match the RegEx: (C|c|M|m|X|x)(S|s|P|p)[A-z0-9 -]{1,4}`;
    },
  })
  stackName: string;

  @IsString()
  @MatchesRegEx('^[A-z0-9 -*#]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITSTACKCONFIG-FATAL-A] The value : ${args.value} for ${args.property} must be match the RegEx: [A-z0-9 -*#]{1,6}`;
    },
  })
  unitName: string;
}
