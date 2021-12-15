import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MonitorSpanBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOComponentTypeCode.description,
    example: propertyMetadata.monitorSpanDTOComponentTypeCode.example,
    name: propertyMetadata.monitorSpanDTOComponentTypeCode.fieldLabels.value
  })
  componentTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanScaleCode.description,
    example: propertyMetadata.monitorSpanDTOSpanScaleCode.example,
    name: propertyMetadata.monitorSpanDTOSpanScaleCode.fieldLabels.value
  })
  spanScaleCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanMethodCode.description,
    example: propertyMetadata.monitorSpanDTOSpanMethodCode.example,
    name: propertyMetadata.monitorSpanDTOSpanMethodCode.fieldLabels.value
  })
  spanMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMecValue.description,
    example: propertyMetadata.monitorSpanDTOMecValue.example,
    name: propertyMetadata.monitorSpanDTOMecValue.fieldLabels.value
  })
  mecValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMpcValue.description,
    example: propertyMetadata.monitorSpanDTOMpcValue.example,
    name: propertyMetadata.monitorSpanDTOMpcValue.fieldLabels.value
  })
  mpcValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMpfValue.description,
    example: propertyMetadata.monitorSpanDTOMpfValue.example,
    name: propertyMetadata.monitorSpanDTOMpfValue.fieldLabels.value
  })
  mpfValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanValue.description,
    example: propertyMetadata.monitorSpanDTOSpanValue.example,
    name: propertyMetadata.monitorSpanDTOSpanValue.fieldLabels.value
  })
  spanValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFullScaleRange.description,
    example: propertyMetadata.monitorSpanDTOFullScaleRange.example,
    name: propertyMetadata.monitorSpanDTOFullScaleRange.fieldLabels.value
  })
  fullScaleRange: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.description,
    example: propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.example,
    name: propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.fieldLabels.value
  })
  spanUnitsOfMeasureCode: string;


  scaleTransitionPoint: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTODefaultHighRange.description,
    example: propertyMetadata.monitorSpanDTODefaultHighRange.example,
    name: propertyMetadata.monitorSpanDTODefaultHighRange.fieldLabels.value
  })
  defaultHighRange: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFlowSpanValue.description,
    example: propertyMetadata.monitorSpanDTOFlowSpanValue.example,
    name: propertyMetadata.monitorSpanDTOFlowSpanValue.fieldLabels.value
  })
  flowSpanValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFlowFullScaleRange.description,
    example: propertyMetadata.monitorSpanDTOFlowFullScaleRange.example,
    name: propertyMetadata.monitorSpanDTOFlowFullScaleRange.fieldLabels.value
  })
  flowFullScaleRange: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOBeginDate.description,
    example: propertyMetadata.monitorSpanDTOBeginDate.example,
    name: propertyMetadata.monitorSpanDTOBeginDate.fieldLabels.value
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOBeginHour.description,
    example: propertyMetadata.monitorSpanDTOBeginHour.example,
    name: propertyMetadata.monitorSpanDTOBeginHour.fieldLabels.value
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOEndDate.description,
    example: propertyMetadata.monitorSpanDTOEndDate.example,
    name: propertyMetadata.monitorSpanDTOEndDate.fieldLabels.value
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOEndHour.description,
    example: propertyMetadata.monitorSpanDTOEndHour.example,
    name: propertyMetadata.monitorSpanDTOEndHour.fieldLabels.value
  })
  endHour: number;
}
