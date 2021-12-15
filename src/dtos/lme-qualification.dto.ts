import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { LMEQualificationBaseDTO } from './lme-qualification-base.dto';

export class LMEQualificationDTO extends LMEQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOId.description,
    example: propertyMetadata.lMEQualificationDTOId.example,
    name: propertyMetadata.lMEQualificationDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOQualificationId.description,
    example: propertyMetadata.lMEQualificationDTOQualificationId.example,
    name: propertyMetadata.lMEQualificationDTOQualificationId.fieldLabels.value
  })
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOUserId.description,
    example: propertyMetadata.lMEQualificationDTOUserId.example,
    name: propertyMetadata.lMEQualificationDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOAddDate.description,
    example: propertyMetadata.lMEQualificationDTOAddDate.example,
    name: propertyMetadata.lMEQualificationDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.lMEQualificationDTOUpdateDate.description,
    example: propertyMetadata.lMEQualificationDTOUpdateDate.example,
    name: propertyMetadata.lMEQualificationDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;
}
