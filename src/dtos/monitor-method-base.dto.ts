import { IsNotEmpty, ValidateIf, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
export class MonitorMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOParameterCode.description,
    example: propertyMetadata.monitorMethodDTOParameterCode.example,
    name: propertyMetadata.monitorMethodDTOParameterCode.fieldLabels.value,
  })
  parameterCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOMonitoringMethodCode.description,
    example: propertyMetadata.monitorMethodDTOMonitoringMethodCode.example,
    name:
      propertyMetadata.monitorMethodDTOMonitoringMethodCode.fieldLabels.value,
  })
  monitoringMethodCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOSubstituteDataCode.description,
    example: propertyMetadata.monitorMethodDTOSubstituteDataCode.example,
    name: propertyMetadata.monitorMethodDTOSubstituteDataCode.fieldLabels.value,
  })
  @IsOptional()
  substituteDataCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOBypassApproachCode.description,
    example: propertyMetadata.monitorMethodDTOBypassApproachCode.example,
    name: propertyMetadata.monitorMethodDTOBypassApproachCode.fieldLabels.value,
  })
  @IsOptional()
  bypassApproachCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOBeginDate.description,
    example: propertyMetadata.monitorMethodDTOBeginDate.example,
    name: propertyMetadata.monitorMethodDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOBeginHour.description,
    example: propertyMetadata.monitorMethodDTOBeginHour.example,
    name: propertyMetadata.monitorMethodDTOBeginHour.fieldLabels.value,
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOEndDate.description,
    example: propertyMetadata.monitorMethodDTOEndDate.example,
    name: propertyMetadata.monitorMethodDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOEndHour.description,
    example: propertyMetadata.monitorMethodDTOEndHour.example,
    name: propertyMetadata.monitorMethodDTOEndHour.fieldLabels.value,
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
