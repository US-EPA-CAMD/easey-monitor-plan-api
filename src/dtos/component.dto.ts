import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { Type } from 'class-transformer';
import { AnalyzerRangeBaseDTO } from './analyzer-range.dto';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
    example: propertyMetadata.componentDTOComponentId.example,
    name: propertyMetadata.componentDTOComponentId.fieldLabels.value,
  })
  @IsString()
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} is not formatted properly`;
    },
  })
  componentId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentTypeCode.description,
    example: propertyMetadata.componentDTOComponentTypeCode.example,
    name: propertyMetadata.componentDTOComponentTypeCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct component_type_code as "value" FROM camdecmpsmd.vw_systemcomponent_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSCOMP-FATAL-B] The value for ${args.value} in the Component record ${args.property} is invalid`;
      },
    },
  )
  componentTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.componentDTOSampleAcquisitionMethodCode.description,
    example: propertyMetadata.componentDTOSampleAcquisitionMethodCode.example,
    name:
      propertyMetadata.componentDTOSampleAcquisitionMethodCode.fieldLabels
        .value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct sample_aquisition_method_code as "value" FROM camdecmpsmd.vw_systemcomponent_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSCOMP-FATAL-B] The value for ${args.value} in the Component record ${args.property} is invalid`;
      },
    },
  )
  sampleAcquisitionMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOBasisCode.description,
    example: propertyMetadata.componentDTOBasisCode.example,
    name: propertyMetadata.componentDTOBasisCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct basis_code as "value" FROM camdecmpsmd.vw_systemcomponent_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSCOMP-FATAL-B] The value for ${args.value} in the Component record ${args.property} is invalid`;
      },
    },
  )
  basisCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOManufacturer.description,
    example: propertyMetadata.componentDTOManufacturer.example,
    name: propertyMetadata.componentDTOManufacturer.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(25, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the Component record ${args.property} must not exceed 25 characters`;
    },
  })
  manufacturer: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOModelVersion.description,
    example: propertyMetadata.componentDTOModelVersion.example,
    name: propertyMetadata.componentDTOModelVersion.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(15, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the Component record ${args.property} must not exceed 15 characters`;
    },
  })
  modelVersion: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOSerialNumber.description,
    example: propertyMetadata.componentDTOSerialNumber.example,
    name: propertyMetadata.componentDTOSerialNumber.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(20, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the Component record ${args.property} must not exceed 20 characters`;
    },
  })
  serialNumber: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOHgConverterIndicator.description,
    example: propertyMetadata.componentDTOHgConverterIndicator.example,
    name: propertyMetadata.componentDTOHgConverterIndicator.fieldLabels.value,
  })
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the Component record ${args.property} must be within the range of 0 and 1`;
    },
  })
  @IsOptional()
  hgConverterIndicator: number;
}

export class UpdateComponentBaseDTO extends ComponentBaseDTO {
  @ValidateNested()
  @Type(() => AnalyzerRangeBaseDTO)
  analyzerRanges: AnalyzerRangeBaseDTO[];
}

export class ComponentDTO extends UpdateComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.componentDTOId.description,
    example: propertyMetadata.componentDTOId.example,
    name: propertyMetadata.componentDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOLocationId.description,
    example: propertyMetadata.componentDTOLocationId.example,
    name: propertyMetadata.componentDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOUserId.description,
    example: propertyMetadata.componentDTOUserId.example,
    name: propertyMetadata.componentDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOAddDate.description,
    example: propertyMetadata.componentDTOAddDate.example,
    name: propertyMetadata.componentDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.componentDTOUpdateDate.description,
    example: propertyMetadata.componentDTOUpdateDate.example,
    name: propertyMetadata.componentDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;
}
