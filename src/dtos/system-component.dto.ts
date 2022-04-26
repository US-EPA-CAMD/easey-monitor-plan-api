import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsInt,
  IsNotEmpty,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ComponentBaseDTO } from './component.dto';
import { IsInRange } from '@us-epa-camd/easey-common/pipes/is-in-range.pipe';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';

export class SystemComponentBaseDTO extends ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginDate.description,
    example: propertyMetadata.systemComponentDTOBeginDate.example,
    name: propertyMetadata.systemComponentDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginHour.description,
    example: propertyMetadata.systemComponentDTOBeginHour.example,
    name: propertyMetadata.systemComponentDTOBeginHour.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndDate.description,
    example: propertyMetadata.systemComponentDTOEndDate.example,
    name: propertyMetadata.systemComponentDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndHour.description,
    example: propertyMetadata.systemComponentDTOEndHour.example,
    name: propertyMetadata.systemComponentDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSCOMP-FATAL-A] The value for ${args.value} in the System Component record ${args.property} must be within the range of 0 and 23`;
    },
  })
  endHour: number;
}

export class SystemComponentDTO extends SystemComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemComponentDTOId.description,
    example: propertyMetadata.systemComponentDTOId.example,
    name: propertyMetadata.systemComponentDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOLocationId.description,
    example: propertyMetadata.systemComponentDTOLocationId.example,
    name: propertyMetadata.systemComponentDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.description,
    example:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.example,
    name:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.fieldLabels
        .value,
  })
  monitoringSystemRecordId: string;

  @ApiProperty({
    description:
      propertyMetadata.systemComponentDTOComponentRecordId.description,
    example: propertyMetadata.systemComponentDTOComponentRecordId.example,
    name:
      propertyMetadata.systemComponentDTOComponentRecordId.fieldLabels.value,
  })
  componentRecordId: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOUserId.description,
    example: propertyMetadata.systemComponentDTOUserId.example,
    name: propertyMetadata.systemComponentDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOAddDate.description,
    example: propertyMetadata.systemComponentDTOAddDate.example,
    name: propertyMetadata.systemComponentDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOUpdateDate.description,
    example: propertyMetadata.systemComponentDTOUpdateDate.example,
    name: propertyMetadata.systemComponentDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOActive.description,
    example: propertyMetadata.systemComponentDTOActive.example,
    name: propertyMetadata.systemComponentDTOActive.fieldLabels.value,
  })
  active: boolean;
}
