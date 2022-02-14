import { IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MonitorLoadBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOMaximumLoadValue.description,
    example: propertyMetadata.monitorLoadDTOMaximumLoadValue.example,
    name: propertyMetadata.monitorLoadDTOMaximumLoadValue.fieldLabels.value,
  })
  maximumLoadValue: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOMaximumLoadUnitsOfMeasureCode.description,
    example:
      propertyMetadata.monitorLoadDTOMaximumLoadUnitsOfMeasureCode.example,
    name:
      propertyMetadata.monitorLoadDTOMaximumLoadUnitsOfMeasureCode.fieldLabels
        .value,
  })
  maximumLoadUnitsOfMeasureCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOLowerOperationBoundary.description,
    example: propertyMetadata.monitorLoadDTOLowerOperationBoundary.example,
    name:
      propertyMetadata.monitorLoadDTOLowerOperationBoundary.fieldLabels.value,
  })
  lowerOperationBoundary: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOUpperOperationBoundary.description,
    example: propertyMetadata.monitorLoadDTOUpperOperationBoundary.example,
    name:
      propertyMetadata.monitorLoadDTOUpperOperationBoundary.fieldLabels.value,
  })
  upperOperationBoundary: number;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTONormalLevelCode.description,
    example: propertyMetadata.monitorLoadDTONormalLevelCode.example,
    name: propertyMetadata.monitorLoadDTONormalLevelCode.fieldLabels.value,
  })
  normalLevelCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOSecondLevelCode.description,
    example: propertyMetadata.monitorLoadDTOSecondLevelCode.example,
    name: propertyMetadata.monitorLoadDTOSecondLevelCode.fieldLabels.value,
  })
  secondLevelCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOSecondNormalIndicator.description,
    example: propertyMetadata.monitorLoadDTOSecondNormalIndicator.example,
    name:
      propertyMetadata.monitorLoadDTOSecondNormalIndicator.fieldLabels.value,
  })
  secondNormalIndicator: number;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOLoadAnalysisDate.description,
    example: propertyMetadata.monitorLoadDTOLoadAnalysisDate.example,
    name: propertyMetadata.monitorLoadDTOLoadAnalysisDate.fieldLabels.value,
  })
  loadAnalysisDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOBeginDate.description,
    example: propertyMetadata.monitorLoadDTOBeginDate.example,
    name: propertyMetadata.monitorLoadDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOBeginHour.description,
    example: propertyMetadata.monitorLoadDTOBeginHour.example,
    name: propertyMetadata.monitorLoadDTOBeginHour.fieldLabels.value,
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOEndDate.description,
    example: propertyMetadata.monitorLoadDTOEndDate.example,
    name: propertyMetadata.monitorLoadDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOEndHour.description,
    example: propertyMetadata.monitorLoadDTOEndHour.example,
    name: propertyMetadata.monitorLoadDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
