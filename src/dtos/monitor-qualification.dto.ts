import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LEEQualificationBaseDTO } from './lee-qualification.dto';
import { LMEQualificationBaseDTO } from './lme-qualification.dto';
import { PCTQualificationBaseDTO } from './pct-qualification.dto';

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

  @ValidateNested()
  @Type(() => LEEQualificationBaseDTO)
  leeQualifications: LEEQualificationBaseDTO[];

  @ValidateNested()
  @Type(() => LMEQualificationBaseDTO)
  lmeQualifications: LMEQualificationBaseDTO[];

  @ValidateNested()
  @Type(() => PCTQualificationBaseDTO)
  pctQualifications: PCTQualificationBaseDTO[];
}

export class MonitorQualificationDTO extends MonitorQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOId.description,
    example: propertyMetadata.monitorQualificationDTOId.example,
    name: propertyMetadata.monitorQualificationDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOLocationId.description,
    example: propertyMetadata.monitorQualificationDTOLocationId.example,
    name: propertyMetadata.monitorQualificationDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOUserId.description,
    example: propertyMetadata.monitorQualificationDTOUserId.example,
    name: propertyMetadata.monitorQualificationDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOAddDate.description,
    example: propertyMetadata.monitorQualificationDTOAddDate.example,
    name: propertyMetadata.monitorQualificationDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOUpdateDate.description,
    example: propertyMetadata.monitorQualificationDTOUpdateDate.example,
    name: propertyMetadata.monitorQualificationDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOActive.description,
    example: propertyMetadata.monitorQualificationDTOActive.example,
    name: propertyMetadata.monitorQualificationDTOActive.fieldLabels.value,
  })
  active: boolean;
}
