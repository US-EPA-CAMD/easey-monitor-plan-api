import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorPlanCommentDTO } from './monitor-plan-comment.dto';
import { UnitStackConfigurationDTO } from './unit-stack-configuration.dto';
import { MonitorLocationDTO } from './monitor-location.dto';
import { IsNumber, ValidationArguments } from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

export class MonitorPlanDTO {
  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOId.description,
    example: propertyMetadata.monitorPlanDTOId.example,
    name: propertyMetadata.monitorPlanDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOOrisCode.description,
    example: propertyMetadata.monitorPlanDTOOrisCode.example,
    name: propertyMetadata.monitorPlanDTOOrisCode.fieldLabels.value,
  })
  orisCode: number;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facId: number;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOName.description,
    example: propertyMetadata.monitorPlanDTOName.example,
    name: propertyMetadata.monitorPlanDTOName.fieldLabels.value,
  })
  name: string;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOEndReportPeriodId.description,
    example: propertyMetadata.monitorPlanDTOEndReportPeriodId.example,
    name: propertyMetadata.monitorPlanDTOEndReportPeriodId.fieldLabels.value,
  })
  endReportPeriodId: number;
  active: boolean;
  comments: MonitorPlanCommentDTO[];
  unitStackConfiguration: UnitStackConfigurationDTO[];
  locations: MonitorLocationDTO[];
  evalStatusCode: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
}
