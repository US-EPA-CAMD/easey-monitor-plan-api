import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

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
  @IsOptional()
  @IsString()
  unitid: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOSourceCategoryCd.description,
    example: propertyMetadata.unitDTOSourceCategoryCd.example,
    name: propertyMetadata.unitDTOSourceCategoryCd.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  sourceCategoryCd: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOCommOpDate.description,
    example: propertyMetadata.unitDTOCommOpDate.example,
    name: propertyMetadata.unitDTOCommOpDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  commOpDate: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOComrOpDate.description,
    example: propertyMetadata.unitDTOComrOpDate.example,
    name: propertyMetadata.unitDTOComrOpDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  comrOpDate: string;

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
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOOpStatusCd.description,
    example: propertyMetadata.unitDTOOpStatusCd.example,
    name: propertyMetadata.unitDTOOpStatusCd.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  opStatusCd: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOStatusBeginDate.description,
    example: propertyMetadata.unitDTOStatusBeginDate.example,
    name: propertyMetadata.unitDTOStatusBeginDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  statusBeginDate: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOUnitTypeCd.description,
    example: propertyMetadata.unitDTOUnitTypeCd.example,
    name: propertyMetadata.unitDTOUnitTypeCd.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  unitTypeCd: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOAuditUser.description,
    example: propertyMetadata.unitDTOAuditUser.example,
    name: propertyMetadata.unitDTOAuditUser.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  auditUser: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOAuditDate.description,
    example: propertyMetadata.unitDTOAuditDate.example,
    name: propertyMetadata.unitDTOAuditDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  auditDate: string;

  @ApiProperty({
    description: propertyMetadata.unitDTOActive.description,
    example: propertyMetadata.unitDTOActive.example,
    name: propertyMetadata.unitDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}

