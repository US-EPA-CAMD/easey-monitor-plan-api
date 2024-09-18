import { ApiProperty } from '@nestjs/swagger';
import {
  DATE_FORMAT,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
  ValidateIf,
} from 'class-validator';
import {
  IsInRange,
  IsValidDate,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';

import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

const KEY = 'Unit';

export class UnitBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitDTONonLoadBasedIndicator.description,
    example: propertyMetadata.unitDTONonLoadBasedIndicator.example,
    name: propertyMetadata.unitDTONonLoadBasedIndicator.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Unit record [${args.property}] must be within the range of 0 and 1`;
    },
  })
  nonLoadBasedIndicator: number;
}

export class UnitDTO extends UnitBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitDTOId.description,
    example: propertyMetadata.unitDTOId.example,
    name: propertyMetadata.unitDTOId.fieldLabels.value,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: propertyMetadata.unitDTOUnitid.description,
    example: propertyMetadata.unitDTOUnitid.example,
    name: propertyMetadata.unitDTOUnitid.fieldLabels.value,
  })
  @MatchesRegEx('^[A-z0-9\\-\\*#]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `The value [${args.value}] for [${args.property}] must be match the RegEx: [A-Za-z0-9-*#]{1,6} for [${KEY}].`;
    },
  })
  @IsString()
  unitId: string;

  @IsNumber()
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facilityId: number;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOBeginDate.description,
    example: propertyMetadata.monitorQualificationDTOBeginDate.example,
    name: propertyMetadata.monitorQualificationDTOBeginDate.fieldLabels.value,
  })
  @ValidateIf(o => o.beginDate !== null)
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOEndDate.description,
    example: propertyMetadata.monitorQualificationDTOEndDate.example,
    name: propertyMetadata.monitorQualificationDTOEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null)
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitDTOSourceCategoryCd.description,
    example: propertyMetadata.unitDTOSourceCategoryCd.example,
    name: propertyMetadata.unitDTOSourceCategoryCd.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  sourceCategoryCd?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOCommOpDate.description,
    example: propertyMetadata.unitDTOCommOpDate.example,
    name: propertyMetadata.unitDTOCommOpDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  commOpDate?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOComrOpDate.description,
    example: propertyMetadata.unitDTOComrOpDate.example,
    name: propertyMetadata.unitDTOComrOpDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  comrOpDate?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOUserId.description,
    example: propertyMetadata.unitDTOUserId.example,
    name: propertyMetadata.unitDTOUserId.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOAddDate.description,
    example: propertyMetadata.unitDTOAddDate.example,
    name: propertyMetadata.unitDTOAddDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOUpdateDate.description,
    example: propertyMetadata.unitDTOUpdateDate.example,
    name: propertyMetadata.unitDTOUpdateDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  updateDate?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOOpStatusCd.description,
    example: propertyMetadata.unitDTOOpStatusCd.example,
    name: propertyMetadata.unitDTOOpStatusCd.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  opStatusCd?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOStatusBeginDate.description,
    example: propertyMetadata.unitDTOStatusBeginDate.example,
    name: propertyMetadata.unitDTOStatusBeginDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  statusBeginDate?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOUnitTypeCd.description,
    example: propertyMetadata.unitDTOUnitTypeCd.example,
    name: propertyMetadata.unitDTOUnitTypeCd.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  unitTypeCd?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOAuditUser.description,
    example: propertyMetadata.unitDTOAuditUser.example,
    name: propertyMetadata.unitDTOAuditUser.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  auditUser?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOAuditDate.description,
    example: propertyMetadata.unitDTOAuditDate.example,
    name: propertyMetadata.unitDTOAuditDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  auditDate?: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOActive.description,
    example: propertyMetadata.unitDTOActive.example,
    name: propertyMetadata.unitDTOActive.fieldLabels.value,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
