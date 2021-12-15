import { ComponentBaseDTO } from './component-base.dto';
import { AnalyzerRangeDTO } from './analyzer-range.dto';
import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';


export class ComponentDTO extends ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.componentDTOId.description,
    example: propertyMetadata.componentDTOId.example,
    name: propertyMetadata.componentDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOLocationId.description,
    example: propertyMetadata.componentDTOLocationId.example,
    name: propertyMetadata.componentDTOLocationId.fieldLabels.value
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOUserId.description,
    example: propertyMetadata.componentDTOUserId.example,
    name: propertyMetadata.componentDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOAddDate.description,
    example: propertyMetadata.componentDTOAddDate.example,
    name: propertyMetadata.componentDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.componentDTOUpdateDate.description,
    example: propertyMetadata.componentDTOUpdateDate.example,
    name: propertyMetadata.componentDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    isArray: true,
  })
  analyzerRanges: AnalyzerRangeDTO[];
}
