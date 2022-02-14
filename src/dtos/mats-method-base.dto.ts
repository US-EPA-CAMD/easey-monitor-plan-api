import { IsNotEmpty, ValidateIf, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MatsMethodBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.matsMethodDTOSupplementalMATSParameterCode.description,
    example:
      propertyMetadata.matsMethodDTOSupplementalMATSParameterCode.example,
    name:
      propertyMetadata.matsMethodDTOSupplementalMATSParameterCode.fieldLabels
        .value,
  })
  supplementalMATSParameterCode: string;

  @ApiProperty({
    description:
      propertyMetadata.matsMethodDTOSupplementalMATSMonitoringMethodCode
        .description,
    example:
      propertyMetadata.matsMethodDTOSupplementalMATSMonitoringMethodCode
        .example,
    name:
      propertyMetadata.matsMethodDTOSupplementalMATSMonitoringMethodCode
        .fieldLabels.value,
  })
  supplementalMATSMonitoringMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOBeginDate.description,
    example: propertyMetadata.matsMethodDTOBeginDate.example,
    name: propertyMetadata.matsMethodDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOBeginHour.description,
    example: propertyMetadata.matsMethodDTOBeginHour.example,
    name: propertyMetadata.matsMethodDTOBeginHour.fieldLabels.value,
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOEndDate.description,
    example: propertyMetadata.matsMethodDTOEndDate.example,
    name: propertyMetadata.matsMethodDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOEndHour.description,
    example: propertyMetadata.matsMethodDTOEndHour.example,
    name: propertyMetadata.matsMethodDTOEndHour.fieldLabels.value,
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
