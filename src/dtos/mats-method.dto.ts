import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MatsMethodBaseDTO } from './mats-method-base.dto';

export class MatsMethodDTO extends MatsMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.matsMethodDTOId.description,
    example: propertyMetadata.matsMethodDTOId.example,
    name: propertyMetadata.matsMethodDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOLocationId.description,
    example: propertyMetadata.matsMethodDTOLocationId.example,
    name: propertyMetadata.matsMethodDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOUserId.description,
    example: propertyMetadata.matsMethodDTOUserId.example,
    name: propertyMetadata.matsMethodDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOAddDate.description,
    example: propertyMetadata.matsMethodDTOAddDate.example,
    name: propertyMetadata.matsMethodDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOUpdateDate.description,
    example: propertyMetadata.matsMethodDTOUpdateDate.example,
    name: propertyMetadata.matsMethodDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOActive.description,
    example: propertyMetadata.matsMethodDTOActive.example,
    name: propertyMetadata.matsMethodDTOActive.fieldLabels.value,
  })
  active: boolean;
}
