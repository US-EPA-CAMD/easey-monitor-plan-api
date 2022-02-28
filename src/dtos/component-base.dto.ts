import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsString,
  MaxLength,
  ValidationArguments,
} from 'class-validator';
import { IsInDbValues } from 'src/import-checks/pipes/is-in-db-values.pipe';

export class ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
    example: propertyMetadata.componentDTOComponentId.example,
    name: propertyMetadata.componentDTOComponentId.fieldLabels.value,
  })
  @IsString()
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
        return `${args.property} [COMPONENT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
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
  @IsInDbValues(
    'SELECT distinct sample_aquisition_method_code as "value" FROM camdecmpsmd.vw_systemcomponent_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [COMPONENT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  sampleAcquisitionMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOBasisCode.description,
    example: propertyMetadata.componentDTOBasisCode.example,
    name: propertyMetadata.componentDTOBasisCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct basis_code as "value" FROM camdecmpsmd.vw_systemcomponent_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [COMPONENT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  basisCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOManufacturer.description,
    example: propertyMetadata.componentDTOManufacturer.example,
    name: propertyMetadata.componentDTOManufacturer.fieldLabels.value,
  })
  @MaxLength(25, {
    message: (args: ValidationArguments) => {
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must not exceed 25 characters`;
    },
  })
  manufacturer: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOModelVersion.description,
    example: propertyMetadata.componentDTOModelVersion.example,
    name: propertyMetadata.componentDTOModelVersion.fieldLabels.value,
  })
  @MaxLength(15, {
    message: (args: ValidationArguments) => {
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must not exceed 15 characters`;
    },
  })
  modelVersion: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOSerialNumber.description,
    example: propertyMetadata.componentDTOSerialNumber.example,
    name: propertyMetadata.componentDTOSerialNumber.fieldLabels.value,
  })
  @MaxLength(20, {
    message: (args: ValidationArguments) => {
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must not exceed 20 characters`;
    },
  })
  serialNumber: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOHgConverterIndicator.description,
    example: propertyMetadata.componentDTOHgConverterIndicator.example,
    name: propertyMetadata.componentDTOHgConverterIndicator.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [COMPONENT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  hgConverterIndicator: number;
}
