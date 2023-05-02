import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
} from '@us-epa-camd/easey-common/pipes';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DATE_FORMAT, MAX_HOUR, MIN_HOUR } from '../utilities/constants';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { MatsMethodsMasterDataRelationships } from '../entities/mats-methods-master-data-relationship.entity';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Supplemental MATS Monitoring Method';
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
  @IsNotEmpty({
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-6-A');
    },
  })
  @IsValidCode(MatsMethodsMasterDataRelationships, {
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-6-B');
    },
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
  @IsNotEmpty({
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-7-A');
    },
  })
  @IsValidCode(
    MatsMethodsMasterDataRelationships,
    {
      message: () => {
        return CheckCatalogService.formatResultMessage('MATSMTH-7-B');
      },
    },
    (args: ValidationArguments): FindManyOptions<any> => {
      return { where: { methodCode: args.value } };
    },
  )
  supplementalMATSMonitoringMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOBeginDate.description,
    example: propertyMetadata.matsMethodDTOBeginDate.example,
    name: propertyMetadata.matsMethodDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-1-A');
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldName] in the [key] record must be a valid ISO date format [dateFormat]`,
        {
          fieldName: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOBeginHour.description,
    example: propertyMetadata.matsMethodDTOBeginHour.example,
    name: propertyMetadata.matsMethodDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-2-A');
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-2-B');
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOEndDate.description,
    example: propertyMetadata.matsMethodDTOEndDate.example,
    name: propertyMetadata.matsMethodDTOEndDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldName] in the [key] record must be a valid ISO date format [dateFormat]`,
        {
          fieldName: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  @IsNotEmpty({
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-4-A');
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOEndHour.description,
    example: propertyMetadata.matsMethodDTOEndHour.example,
    name: propertyMetadata.matsMethodDTOEndHour.fieldLabels.value,
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: () => {
      return CheckCatalogService.formatResultMessage('MATSMTH-4-B');
    },
  })
  @ValidateIf(o => o.endHour !== null)
  @BeginEndDatesConsistent({
    //skipIf: (o) => { return o.endHour === null },
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MATSMTH-5-A', {});
    },
  })
  endHour: number;
}

export class MatsMethodDTO extends MatsMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.matsMethodDTOId.description,
    example: propertyMetadata.matsMethodDTOId.example,
    name: propertyMetadata.matsMethodDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOLocationId.description,
    example: propertyMetadata.matsMethodDTOLocationId.example,
    name: propertyMetadata.matsMethodDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOUserId.description,
    example: propertyMetadata.matsMethodDTOUserId.example,
    name: propertyMetadata.matsMethodDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOAddDate.description,
    example: propertyMetadata.matsMethodDTOAddDate.example,
    name: propertyMetadata.matsMethodDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOUpdateDate.description,
    example: propertyMetadata.matsMethodDTOUpdateDate.example,
    name: propertyMetadata.matsMethodDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.matsMethodDTOActive.description,
    example: propertyMetadata.matsMethodDTOActive.example,
    name: propertyMetadata.matsMethodDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
