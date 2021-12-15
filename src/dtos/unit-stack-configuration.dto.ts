import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { UnitStackConfigurationBaseDTO } from './unit-stack-configuration-base.dto';

export class UnitStackConfigurationDTO extends UnitStackConfigurationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOId.description,
    example: propertyMetadata.unitStackConfigurationDTOId.example,
    name: propertyMetadata.unitStackConfigurationDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUserId.description,
    example: propertyMetadata.unitStackConfigurationDTOUserId.example,
    name: propertyMetadata.unitStackConfigurationDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOAddDate.description,
    example: propertyMetadata.unitStackConfigurationDTOAddDate.example,
    name: propertyMetadata.unitStackConfigurationDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOUpdateDate.description,
    example: propertyMetadata.unitStackConfigurationDTOUpdateDate.example,
    name: propertyMetadata.unitStackConfigurationDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitStackConfigurationDTOActive.description,
    example: propertyMetadata.unitStackConfigurationDTOActive.example,
    name: propertyMetadata.unitStackConfigurationDTOActive.fieldLabels.value
  })
  active: boolean;

  stackName: string;
}
