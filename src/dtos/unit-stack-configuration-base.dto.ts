import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsNotEmpty, IsString, ValidationArguments } from 'class-validator';
import { MatchesRegEx } from 'src/import-checks/pipes/matches-regex.pipe';

export class UnitStackConfigurationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUnitId.description,
    example: propertyMetadata.unitStackConfigurationDTOUnitId.example,
    name: propertyMetadata.unitStackConfigurationDTOUnitId.fieldLabels.value,
  })
  @IsNotEmpty()
  @MatchesRegEx('[A-z0-9 -*#]{1,6}', {
    message: (args: ValidationArguments) => {
      return `${args.property} [MONLOC-FATAL-A] The value : ${args.value} for ${args.property} must be match the RegEx: [A-z0-9 -*#]{1,6}`;
    },
  })
  unitId: number;

  @ApiProperty({
    description:
      propertyMetadata.unitStackConfigurationDTOStackPipeId.description,
    example: propertyMetadata.unitStackConfigurationDTOStackPipeId.example,
    name:
      propertyMetadata.unitStackConfigurationDTOStackPipeId.fieldLabels.value,
  })
  stackPipeId: string;

  @ApiProperty({
    description:
      propertyMetadata.unitStackConfigurationDTOBeginDate.description,
    example: propertyMetadata.unitStackConfigurationDTOBeginDate.example,
    name: propertyMetadata.unitStackConfigurationDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOEndDate.description,
    example: propertyMetadata.unitStackConfigurationDTOEndDate.example,
    name: propertyMetadata.unitStackConfigurationDTOEndDate.fieldLabels.value,
  })
  endDate: Date;
}
