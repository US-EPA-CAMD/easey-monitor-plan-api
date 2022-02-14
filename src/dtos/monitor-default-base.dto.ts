import { IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MonitorDefaultBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOParameterCode.description,
    example: propertyMetadata.monitorDefaultDTOParameterCode.example,
    name: propertyMetadata.monitorDefaultDTOParameterCode.fieldLabels.value,
  })
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTODefaultValue.description,
    example: propertyMetadata.monitorDefaultDTODefaultValue.example,
    name: propertyMetadata.monitorDefaultDTODefaultValue.fieldLabels.value,
  })
  defaultValue: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.description,
    example:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.example,
    name:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.fieldLabels
        .value,
  })
  defaultUnitsOfMeasureCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultPurposeCode.description,
    example: propertyMetadata.monitorDefaultDTODefaultPurposeCode.example,
    name:
      propertyMetadata.monitorDefaultDTODefaultPurposeCode.fieldLabels.value,
  })
  defaultPurposeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOFuelCode.description,
    example: propertyMetadata.monitorDefaultDTOFuelCode.example,
    name: propertyMetadata.monitorDefaultDTOFuelCode.fieldLabels.value,
  })
  fuelCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTOOperatingConditionCode.description,
    example: propertyMetadata.monitorDefaultDTOOperatingConditionCode.example,
    name:
      propertyMetadata.monitorDefaultDTOOperatingConditionCode.fieldLabels
        .value,
  })
  operatingConditionCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultSourceCode.description,
    example: propertyMetadata.monitorDefaultDTODefaultSourceCode.example,
    name: propertyMetadata.monitorDefaultDTODefaultSourceCode.fieldLabels.value,
  })
  defaultSourceCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOGroupId.description,
    example: propertyMetadata.monitorDefaultDTOGroupId.example,
    name: propertyMetadata.monitorDefaultDTOGroupId.fieldLabels.value,
  })
  groupId: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOBeginDate.description,
    example: propertyMetadata.monitorDefaultDTOBeginDate.example,
    name: propertyMetadata.monitorDefaultDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOBeginHour.description,
    example: propertyMetadata.monitorDefaultDTOBeginHour.example,
    name: propertyMetadata.monitorDefaultDTOBeginHour.fieldLabels.value,
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOEndDate.description,
    example: propertyMetadata.monitorDefaultDTOEndDate.example,
    name: propertyMetadata.monitorDefaultDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOEndHour.description,
    example: propertyMetadata.monitorDefaultDTOEndHour.example,
    name: propertyMetadata.monitorDefaultDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
