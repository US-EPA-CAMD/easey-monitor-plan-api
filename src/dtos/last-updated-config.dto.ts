import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { MonitorPlan } from '../entities/monitor-plan.entity';
import { IsValidDateWithinLastYear } from '../pipes/is-valid-date-last-year.pipe';
export class LastUpdatedConfigDTO {
  changedConfigs: MonitorPlan[];

  @IsDateString()
  mostRecentUpdate: Date;
}

export class LastUpdatedConfigQueryDTO {
  @IsValidDateWithinLastYear()
  @ApiProperty({
    type: String,
    format: propertyMetadata.date.fieldLabels.value,
    example: propertyMetadata.date.example,
    description: propertyMetadata.date.description + ` Must be within the last year from current date and cannot be in the future.`,
    required: true
  })
  date: Date;
}
