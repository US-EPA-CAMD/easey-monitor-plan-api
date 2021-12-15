import { DuctWafBaseDTO } from './duct-waf-base.dto';
import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class DuctWafDTO extends DuctWafBaseDTO {
  @ApiProperty({
    description: propertyMetadata.ductWafDTOId.description,
    example: propertyMetadata.ductWafDTOId.example,
    name: propertyMetadata.ductWafDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOLocationId.description,
    example: propertyMetadata.ductWafDTOLocationId.example,
    name: propertyMetadata.ductWafDTOLocationId.fieldLabels.value
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOUserId.description,
    example: propertyMetadata.ductWafDTOUserId.example,
    name: propertyMetadata.ductWafDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOAddDate.description,
    example: propertyMetadata.ductWafDTOAddDate.example,
    name: propertyMetadata.ductWafDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOUpdateDate.description,
    example: propertyMetadata.ductWafDTOUpdateDate.example,
    name: propertyMetadata.ductWafDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;
}
