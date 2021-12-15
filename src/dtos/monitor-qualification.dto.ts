import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorQualificationBaseDTO } from './monitor-qualification-base.dto';
import { LEEQualificationDTO } from './lee-qualification.dto';
import { LMEQualificationDTO } from './lme-qualification.dto';
import { PCTQualificationDTO } from './pct-qualification.dto';

export class MonitorQualificationDTO extends MonitorQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOId.description,
    example: propertyMetadata.monitorQualificationDTOId.example,
    name: propertyMetadata.monitorQualificationDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOLocationId.description,
    example: propertyMetadata.monitorQualificationDTOLocationId.example,
    name: propertyMetadata.monitorQualificationDTOLocationId.fieldLabels.value
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOUserId.description,
    example: propertyMetadata.monitorQualificationDTOUserId.example,
    name: propertyMetadata.monitorQualificationDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOAddDate.description,
    example: propertyMetadata.monitorQualificationDTOAddDate.example,
    name: propertyMetadata.monitorQualificationDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOUpdateDate.description,
    example: propertyMetadata.monitorQualificationDTOUpdateDate.example,
    name: propertyMetadata.monitorQualificationDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOActive.description,
    example: propertyMetadata.monitorQualificationDTOActive.example,
    name: propertyMetadata.monitorQualificationDTOActive.fieldLabels.value
  })
  active: boolean;
  
  leeQualifications: LEEQualificationDTO[];
  lmeQualifications: LMEQualificationDTO[];
  pctQualifications: PCTQualificationDTO[];
}
