import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class UserCheckOutDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value
  })
  facId: number;

  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOId.description,
    example: propertyMetadata.monitorPlanDTOId.example,
    name: propertyMetadata.monitorPlanDTOId.fieldLabels.value
  })
  monPlanId: string;

  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value
  })
  checkedOutOn: Date;

  
  checkedOutBy: string;

  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value
  })
  lastActivity: Date;
}
