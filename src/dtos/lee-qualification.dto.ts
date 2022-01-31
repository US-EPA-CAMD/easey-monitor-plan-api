import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { LEEQualificationBaseDTO } from './lee-qualification-base.dto';

export class LEEQualificationDTO extends LEEQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOId.description,
    example: propertyMetadata.lEEQualificationDTOId.example,
    name: propertyMetadata.lEEQualificationDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOQualificationId.description,
    example: propertyMetadata.lEEQualificationDTOQualificationId.example,
    name: propertyMetadata.lEEQualificationDTOQualificationId.fieldLabels.value,
  })
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOUserId.description,
    example: propertyMetadata.lEEQualificationDTOUserId.example,
    name: propertyMetadata.lEEQualificationDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOAddDate.description,
    example: propertyMetadata.lEEQualificationDTOAddDate.example,
    name: propertyMetadata.lEEQualificationDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOUpdateDate.description,
    example: propertyMetadata.lEEQualificationDTOUpdateDate.example,
    name: propertyMetadata.lEEQualificationDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;
}
