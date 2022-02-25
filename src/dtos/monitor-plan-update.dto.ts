import { ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { UpdateMonitorPlanCommentDTO } from './monitor-plan-comment-update.dto';
import { UpdateUnitStackConfigurationDTO } from './unit-stack-configuration-update.dto';
import { UpdateMonitorLocationDTO } from './monitor-location-update.dto';
import { Type } from 'class-transformer';

export class UpdateMonitorPlanDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOOrisCode.description,
    example: propertyMetadata.monitorPlanDTOOrisCode.example,
    name: propertyMetadata.monitorPlanDTOOrisCode.fieldLabels.value,
  })
  orisCode: number;

  version: string;

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
