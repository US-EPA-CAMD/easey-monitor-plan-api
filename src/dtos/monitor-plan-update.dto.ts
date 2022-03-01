import { IsInt, ValidateNested, ValidationArguments } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { UpdateMonitorPlanCommentDTO } from './monitor-plan-comment-update.dto';
import { UpdateUnitStackConfigurationDTO } from './unit-stack-configuration-update.dto';
import { UpdateMonitorLocationDTO } from './monitor-location-update.dto';
import { Type } from 'class-transformer';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

export class UpdateMonitorPlanDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOOrisCode.description,
    example: propertyMetadata.monitorPlanDTOOrisCode.example,
    name: propertyMetadata.monitorPlanDTOOrisCode.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(1, 999999, {
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLAN-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 1 and 999999`;
    },
  })
  orisCode: number;

  @ValidateNested()
  @Type(() => UpdateMonitorPlanCommentDTO)
  comments: UpdateMonitorPlanCommentDTO[];

  @ValidateNested()
  @Type(() => UpdateUnitStackConfigurationDTO)
  unitStackConfiguration: UpdateUnitStackConfigurationDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorLocationDTO)
  locations: UpdateMonitorLocationDTO[];
}
