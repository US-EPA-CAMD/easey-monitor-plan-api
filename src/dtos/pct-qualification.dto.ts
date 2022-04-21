import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { PCTQualificationBaseDTO } from './pct-qualification-base.dto';

export class PCTQualificationDTO extends PCTQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOId.description,
    example: propertyMetadata.pCTQualificationDTOId.example,
    name: propertyMetadata.pCTQualificationDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOQualificationId.description,
    example: propertyMetadata.pCTQualificationDTOQualificationId.example,
    name: propertyMetadata.pCTQualificationDTOQualificationId.fieldLabels.value,
  })
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOUserId.description,
    example: propertyMetadata.pCTQualificationDTOUserId.example,
    name: propertyMetadata.pCTQualificationDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOAddDate.description,
    example: propertyMetadata.pCTQualificationDTOAddDate.example,
    name: propertyMetadata.pCTQualificationDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOUpdateDate.description,
    example: propertyMetadata.pCTQualificationDTOUpdateDate.example,
    name: propertyMetadata.pCTQualificationDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;
}
