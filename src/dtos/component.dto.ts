import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { Type } from 'class-transformer';
import { AnalyzerRangeBaseDTO, AnalyzerRangeDTO } from './analyzer-range.dto';
import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { SystemComponentMasterDataRelationships } from '../entities/system-component-master-data-relationship.entity';
import { FindOneOptions } from 'typeorm';
import { BasisCode } from '../entities/basis-code.entity';
import { AnalyticalPrincipalCode } from 'src/entities/analytical-principal-code.entity';

const KEY = 'Component';

export class ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
    example: propertyMetadata.componentDTOComponentId.example,
    name: propertyMetadata.componentDTOComponentId.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-8-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-8-B', {
        iD: args.value,
      });
    },
  })
  componentId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentTypeCode.description,
    example: propertyMetadata.componentDTOComponentTypeCode.example,
    name: propertyMetadata.componentDTOComponentTypeCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-12-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(SystemComponentMasterDataRelationships, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-12-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  componentTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.componentDTOAnalyticalPrincipleCode.description,
    example: propertyMetadata.componentDTOAnalyticalPrincipleCode.example,
    name:
      propertyMetadata.componentDTOAnalyticalPrincipleCode.fieldLabels.value,
  })
  @IsValidCode(AnalyticalPrincipalCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value], which is not in the list of valid values, in the field Critical Error Level [fieldname] for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsString()
  @IsOptional()
  analyticalPrincipleCode: string;

  @ApiProperty({
    description:
      propertyMetadata.componentDTOSampleAcquisitionMethodCode.description,
    example: propertyMetadata.componentDTOSampleAcquisitionMethodCode.example,
    name:
      propertyMetadata.componentDTOSampleAcquisitionMethodCode.fieldLabels
        .value,
  })
  @IsValidCode(
    SystemComponentMasterDataRelationships,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('COMPON-13-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        });
      },
    },
    (
      args: ValidationArguments,
    ): FindOneOptions<SystemComponentMasterDataRelationships> => {
      return { where: { sampleAcquisitionMethodCode: args.value } };
    },
  )
  @IsString()
  @IsOptional()
  sampleAcquisitionMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOBasisCode.description,
    example: propertyMetadata.componentDTOBasisCode.example,
    name: propertyMetadata.componentDTOBasisCode.fieldLabels.value,
  })
  @IsValidCode(BasisCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-14-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @IsOptional()
  basisCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOManufacturer.description,
    example: propertyMetadata.componentDTOManufacturer.example,
    name: propertyMetadata.componentDTOManufacturer.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(25, {
    message: (args: ValidationArguments) => {
      return `The value for ${args.value} in the Component record ${args.property} must not exceed 25 characters`;
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
      return `The value for ${args.value} in the Component record ${args.property} must not exceed 15 characters`;
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
      return `The value for ${args.value} in the Component record ${args.property} must not exceed 20 characters`;
    },
  })
  serialNumber: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOHgConverterIndicator.description,
    example: propertyMetadata.componentDTOHgConverterIndicator.example,
    name: propertyMetadata.componentDTOHgConverterIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of ${args.value} for ${args.property} must be within the range of 0 and 1 for ${KEY}`;
    },
  })
  hgConverterIndicator: number;
}

export class UpdateComponentBaseDTO extends ComponentBaseDTO {
  @ValidateNested()
  @Type(() => AnalyzerRangeBaseDTO)
  analyzerRangeData: AnalyzerRangeBaseDTO[];
}

export class ComponentDTO extends ComponentBaseDTO {
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
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOUpdateDate.description,
    example: propertyMetadata.componentDTOUpdateDate.example,
    name: propertyMetadata.componentDTOUpdateDate.fieldLabels.value,
  })
  updateDate: string;

  @ValidateNested()
  @Type(() => AnalyzerRangeDTO)
  analyzerRangeData: AnalyzerRangeDTO[];
}
