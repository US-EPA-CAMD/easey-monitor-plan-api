import { IsString, IsOptional, IsNotEmpty, IsNumber, ValidationArguments } from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DATE_FORMAT} from '../utilities/constants';
import { IsIsoFormat, IsValidDate } from '@us-epa-camd/easey-common/pipes';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

const KEY = 'Unit Program';

export class UnitProgramBaseDTO {

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOProgramId.description,
    example: propertyMetadata.unitProgramDTOProgramId.example,
    name: propertyMetadata.unitProgramDTOProgramId.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsNumber()
  programId: number;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOProgramCode.description,
    example: propertyMetadata.unitProgramDTOProgramCode.example,
    name: propertyMetadata.unitProgramDTOProgramCode.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  programCode: string;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOClassCode.description,
    example: propertyMetadata.unitProgramDTOClassCode.example,
    name: propertyMetadata.unitProgramDTOClassCode.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  classCode: string;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOUnitMonitorCertBeginDate.description,
    example: propertyMetadata.unitProgramDTOUnitMonitorCertBeginDate.example,
    name: propertyMetadata.unitProgramDTOUnitMonitorCertBeginDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat()
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  unitMonitorCertBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOUnitMonitorCertDeadline.description,
    example: propertyMetadata.unitProgramDTOUnitMonitorCertDeadline.example,
    name: propertyMetadata.unitProgramDTOUnitMonitorCertDeadline.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat()
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  unitMonitorCertDeadline: Date;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOEmissionsRecordingBeginDate.description,
    example: propertyMetadata.unitProgramDTOEmissionsRecordingBeginDate.example,
    name: propertyMetadata.unitProgramDTOEmissionsRecordingBeginDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat()
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  emissionsRecordingBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOEndDate.description,
    example: propertyMetadata.unitProgramDTOEndDate.example,
    name: propertyMetadata.unitProgramDTOEndDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Unit Fuel record [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @IsOptional()
  endDate: Date;
}

export class UnitProgramDTO extends UnitProgramBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitProgramDTOId.description,
    example: propertyMetadata.unitProgramDTOId.example,
    name: propertyMetadata.unitProgramDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOUnitRecordId .description,
    example: propertyMetadata.unitProgramDTOUnitRecordId .example,
    name: propertyMetadata.unitProgramDTOUnitRecordId .fieldLabels.value,
  })
  @IsNotEmpty()
  @IsNumber()
  unitRecordId: number;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOUserId.description,
    example: propertyMetadata.unitProgramDTOUserId.example,
    name: propertyMetadata.unitProgramDTOUserId.fieldLabels.value,
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOAddDate.description,
    example: propertyMetadata.unitProgramDTOAddDate.example,
    name: propertyMetadata.unitProgramDTOAddDate.fieldLabels.value,
  })
  @IsString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOUpdateDate.description,
    example: propertyMetadata.unitProgramDTOUpdateDate.example,
    name: propertyMetadata.unitProgramDTOUpdateDate.fieldLabels.value,
  })
  @IsString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.unitProgramDTOActive.description,
    example: propertyMetadata.unitProgramDTOActive.example,
    name: propertyMetadata.unitProgramDTOActive.fieldLabels.value,
  })
  @IsOptional()
  active: boolean;
}

