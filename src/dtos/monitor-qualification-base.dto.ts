import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class MonitorQualificationBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.monitorQualificationDTOQualificationTypeCode.description,
    example:
      propertyMetadata.monitorQualificationDTOQualificationTypeCode.example,
    name:
      propertyMetadata.monitorQualificationDTOQualificationTypeCode.fieldLabels
        .value,
  })
  @IsInDbValues(
    'SELECT qual_type_cd as "value" FROM camdecmpsmd.qual_type_code',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUAL-FATAL-B] The value for ${args.value} in the Qualification record ${args.property} is invalid`;
      },
    },
  )
  qualificationTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOBeginDate.description,
    example: propertyMetadata.monitorQualificationDTOBeginDate.example,
    name: propertyMetadata.monitorQualificationDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [QUAL-FATAL-A] The value for ${args.value} in the Qualification record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOEndDate.description,
    example: propertyMetadata.monitorQualificationDTOEndDate.example,
    name: propertyMetadata.monitorQualificationDTOEndDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [QUAL-FATAL-A] The value for ${args.value} in the Qualification record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  endDate: Date;
}
