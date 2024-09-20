import {
  IsInt,
  IsNotEmpty,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { UnitStackConfigurationBaseDTO } from './unit-stack-configuration.dto';
import { UpdateMonitorLocationDTO } from './monitor-location-update.dto';
import { Type } from 'class-transformer';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { MonitorPlanCommentBaseDTO } from './monitor-plan-comment.dto';

export class UpdateMonitorPlanDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOOrisCode.description,
    example: propertyMetadata.monitorPlanDTOOrisCode.example,
    name: propertyMetadata.monitorPlanDTOOrisCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(1, 999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 1 and 999999.`;
    },
  })
  version: string;

  orisCode: number;

  @ValidateNested()
  @Type(() => MonitorPlanCommentBaseDTO)
  monitoringPlanCommentData: MonitorPlanCommentBaseDTO[];

  @ValidateNested()
  @Type(() => UnitStackConfigurationBaseDTO)
  unitStackConfigurationData: UnitStackConfigurationBaseDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorLocationDTO)
  monitoringLocationData: UpdateMonitorLocationDTO[];
}
