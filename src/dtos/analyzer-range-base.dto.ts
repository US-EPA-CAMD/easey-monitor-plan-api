import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class AnalyzerRangeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.description,
    example: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.example,
    name: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.fieldLabels.value
  })
  analyzerRangeCode: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTODualRangeIndicator.description,
    example: propertyMetadata.analyzerRangeDTODualRangeIndicator.example,
    name: propertyMetadata.analyzerRangeDTODualRangeIndicator.fieldLabels.value
  })
  dualRangeIndicator: number;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOBeginDate.description,
    example: propertyMetadata.analyzerRangeDTOBeginDate.example,
    name: propertyMetadata.analyzerRangeDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOBeginHour.description,
    example: propertyMetadata.analyzerRangeDTOBeginHour.example,
    name: propertyMetadata.analyzerRangeDTOBeginHour.fieldLabels.value
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOEndDate.description,
    example: propertyMetadata.analyzerRangeDTOEndDate.example,
    name: propertyMetadata.analyzerRangeDTOEndDate.fieldLabels.value
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOEndHour.description,
    example: propertyMetadata.analyzerRangeDTOEndHour.example,
    name: propertyMetadata.analyzerRangeDTOEndHour.fieldLabels.value
  })
  endHour: number;
}
