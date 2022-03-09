import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsNotEmpty, ValidationArguments } from 'class-validator';

export class UnitStackConfigurationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUnitId.description,
    example: propertyMetadata.unitStackConfigurationDTOUnitId.example,
    name: propertyMetadata.unitStackConfigurationDTOUnitId.fieldLabels.value,
  })
  @IsNotEmpty()
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
