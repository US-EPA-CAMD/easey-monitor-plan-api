import {
  IsNotEmpty,
  ValidateIf,
  ValidationArguments,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

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
  @IsInDbValues(
    'SELECT distinct parameter_code as "value"  FROM camdecmpsmd.vw_matsmethods_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [MATSMETHOD-FATAL-B] The value for ${args.value} in the Supplemental MATS Monitoring Method record ${args.property} is invalid`;
      },
    },
  )
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
  @IsInDbValues(
    'SELECT distinct method_code as "value" FROM camdecmpsmd.vw_matsmethods_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [MATSMETHOD-FATAL-B] The value for ${args.value} in the Supplemental MATS Monitoring Method record ${args.property} is invalid`;
      },
    },
  )
  supplementalMATSMonitoringMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOBeginDate.description,
    example: propertyMetadata.matsMethodDTOBeginDate.example,
    name: propertyMetadata.matsMethodDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [MATSMETHOD-FATAL-A] The value for ${args.value} in the Supplemental MATS Monitoring Method record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOBeginHour.description,
    example: propertyMetadata.matsMethodDTOBeginHour.example,
    name: propertyMetadata.matsMethodDTOBeginHour.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [MATSMETHOD-FATAL-A] The value for ${args.value} in the Supplemental MATS Monitoring Method record ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOEndDate.description,
    example: propertyMetadata.matsMethodDTOEndDate.example,
    name: propertyMetadata.matsMethodDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [MATSMETHOD-FATAL-A] The value for ${args.value} in the Supplemental MATS Monitoring Method record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOEndHour.description,
    example: propertyMetadata.matsMethodDTOEndHour.example,
    name: propertyMetadata.matsMethodDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [MATSMETHOD-FATAL-A] The value for ${args.value} in the Supplemental MATS Monitoring Method record ${args.property} must be within the range of 0 and 23`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}

export class MatsMethodDTO extends MatsMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.matsMethodDTOId.description,
    example: propertyMetadata.matsMethodDTOId.example,
    name: propertyMetadata.matsMethodDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOLocationId.description,
    example: propertyMetadata.matsMethodDTOLocationId.example,
    name: propertyMetadata.matsMethodDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOUserId.description,
    example: propertyMetadata.matsMethodDTOUserId.example,
    name: propertyMetadata.matsMethodDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOAddDate.description,
    example: propertyMetadata.matsMethodDTOAddDate.example,
    name: propertyMetadata.matsMethodDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOUpdateDate.description,
    example: propertyMetadata.matsMethodDTOUpdateDate.example,
    name: propertyMetadata.matsMethodDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOActive.description,
    example: propertyMetadata.matsMethodDTOActive.example,
    name: propertyMetadata.matsMethodDTOActive.fieldLabels.value,
  })
  active: boolean;
}
