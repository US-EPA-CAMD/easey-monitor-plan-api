import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class DuctWafBaseDTO {
  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafDeterminationDate.description,
    example: propertyMetadata.ductWafDTOWafDeterminationDate.example,
    name: propertyMetadata.ductWafDTOWafDeterminationDate.fieldLabels.value
  })
  wafDeterminationDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafBeginDate.description,
    example: propertyMetadata.ductWafDTOWafBeginDate.example,
    name: propertyMetadata.ductWafDTOWafBeginDate.fieldLabels.value
  })
  wafBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafBeginHour.description,
    example: propertyMetadata.ductWafDTOWafBeginHour.example,
    name: propertyMetadata.ductWafDTOWafBeginHour.fieldLabels.value
  })
  wafBeginHour: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafMethodCode.description,
    example: propertyMetadata.ductWafDTOWafMethodCode.example,
    name: propertyMetadata.ductWafDTOWafMethodCode.fieldLabels.value
  })
  wafMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafValue.description,
    example: propertyMetadata.ductWafDTOWafValue.example,
    name: propertyMetadata.ductWafDTOWafValue.fieldLabels.value
  })
  wafValue: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTestRuns.description,
    example: propertyMetadata.ductWafDTONumberOfTestRuns.example,
    name: propertyMetadata.ductWafDTONumberOfTestRuns.fieldLabels.value
  })
  numberOfTestRuns: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTraversePointsWaf.description,
    example: propertyMetadata.ductWafDTONumberOfTraversePointsWaf.example,
    name: propertyMetadata.ductWafDTONumberOfTraversePointsWaf.fieldLabels.value
  })
  numberOfTraversePointsWaf: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTestPorts.description,
    example: propertyMetadata.ductWafDTONumberOfTestPorts.example,
    name: propertyMetadata.ductWafDTONumberOfTestPorts.fieldLabels.value
  })
  numberOfTestPorts: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTONumberOfTraversePointsRef.description,
    example: propertyMetadata.ductWafDTONumberOfTraversePointsRef.example,
    name: propertyMetadata.ductWafDTONumberOfTraversePointsRef.fieldLabels.value
  })
  numberOfTraversePointsRef: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTODuctWidth.description,
    example: propertyMetadata.ductWafDTODuctWidth.example,
    name: propertyMetadata.ductWafDTODuctWidth.fieldLabels.value
  })
  ductWidth: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTODuctDepth.description,
    example: propertyMetadata.ductWafDTODuctDepth.example,
    name: propertyMetadata.ductWafDTODuctDepth.fieldLabels.value
  })
  ductDepth: number;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafEndDate.description,
    example: propertyMetadata.ductWafDTOWafEndDate.example,
    name: propertyMetadata.ductWafDTOWafEndDate.fieldLabels.value
  })
  wafEndDate: Date;

  @ApiProperty({
    description: propertyMetadata.ductWafDTOWafEndHour.description,
    example: propertyMetadata.ductWafDTOWafEndHour.example,
    name: propertyMetadata.ductWafDTOWafEndHour.fieldLabels.value
  })
  wafEndHour: number;

  active: boolean;
}
