import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInt, ValidationArguments } from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

export class MonitorAttributeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTODuctIndicator.description,
    example: propertyMetadata.monitorAttributeDTODuctIndicator.example,
    name: propertyMetadata.monitorAttributeDTODuctIndicator.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  ductIndicator: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOBypassIndicator.description,
    example: propertyMetadata.monitorAttributeDTOBypassIndicator.example,
    name: propertyMetadata.monitorAttributeDTOBypassIndicator.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  bypassIndicator: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOGroundElevation.description,
    example: propertyMetadata.monitorAttributeDTOGroundElevation.example,
    name: propertyMetadata.monitorAttributeDTOGroundElevation.fieldLabels.value,
  })
  groundElevation: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOStackHeight.description,
    example: propertyMetadata.monitorAttributeDTOStackHeight.example,
    name: propertyMetadata.monitorAttributeDTOStackHeight.fieldLabels.value,
  })
  stackHeight: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOMaterialCode.description,
    example: propertyMetadata.monitorAttributeDTOMaterialCode.example,
    name: propertyMetadata.monitorAttributeDTOMaterialCode.fieldLabels.value,
  })
  materialCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOShapeCode.description,
    example: propertyMetadata.monitorAttributeDTOShapeCode.example,
    name: propertyMetadata.monitorAttributeDTOShapeCode.fieldLabels.value,
  })
  shapeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOCrossAreaFlow.description,
    example: propertyMetadata.monitorAttributeDTOCrossAreaFlow.example,
    name: propertyMetadata.monitorAttributeDTOCrossAreaFlow.fieldLabels.value,
  })
  crossAreaFlow: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOCrossAreaStackExit.description,
    example: propertyMetadata.monitorAttributeDTOCrossAreaStackExit.example,
    name:
      propertyMetadata.monitorAttributeDTOCrossAreaStackExit.fieldLabels.value,
  })
  crossAreaStackExit: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOBeginDate.description,
    example: propertyMetadata.monitorAttributeDTOBeginDate.example,
    name: propertyMetadata.monitorAttributeDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOEndDate.description,
    example: propertyMetadata.monitorAttributeDTOEndDate.example,
    name: propertyMetadata.monitorAttributeDTOEndDate.fieldLabels.value,
  })
  endDate: Date;
}
