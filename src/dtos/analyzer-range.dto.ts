import { AnalyzerRangeBaseDTO } from './analyzer-range-base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class AnalyzerRangeDTO extends AnalyzerRangeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOId.description,
    example: propertyMetadata.analyzerRangeDTOId.example,
    name: propertyMetadata.analyzerRangeDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOComponentRecordId.description,
    example: propertyMetadata.analyzerRangeDTOComponentRecordId.example,
    name: propertyMetadata.analyzerRangeDTOComponentRecordId.fieldLabels.value,
  })
  componentRecordId: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOUserId.description,
    example: propertyMetadata.analyzerRangeDTOUserId.example,
    name: propertyMetadata.analyzerRangeDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOAddDate.description,
    example: propertyMetadata.analyzerRangeDTOAddDate.example,
    name: propertyMetadata.analyzerRangeDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOUpdateDate.description,
    example: propertyMetadata.analyzerRangeDTOUpdateDate.example,
    name: propertyMetadata.analyzerRangeDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOActive.description,
    example: propertyMetadata.analyzerRangeDTOActive.example,
    name: propertyMetadata.analyzerRangeDTOActive.fieldLabels.value,
  })
  active: boolean;
}
