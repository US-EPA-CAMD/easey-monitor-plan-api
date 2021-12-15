import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class UnitStackConfigurationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUnitId.description,
    example: propertyMetadata.unitStackConfigurationDTOUnitId.example,
    name: propertyMetadata.unitStackConfigurationDTOUnitId.fieldLabels.value
  })
  unitId: number;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOStackPipeId.description,
    example: propertyMetadata.unitStackConfigurationDTOStackPipeId.example,
    name: propertyMetadata.unitStackConfigurationDTOStackPipeId.fieldLabels.value
  })
  stackPipeId: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOBeginDate.description,
    example: propertyMetadata.unitStackConfigurationDTOBeginDate.example,
    name: propertyMetadata.unitStackConfigurationDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOEndDate.description,
    example: propertyMetadata.unitStackConfigurationDTOEndDate.example,
    name: propertyMetadata.unitStackConfigurationDTOEndDate.fieldLabels.value
  })
  endDate: Date;
}
