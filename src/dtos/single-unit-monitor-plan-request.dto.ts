import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SingleUnitMonitorPlanRequestDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  facilityId: number;

  @ApiProperty({
    description: propertyMetadata.unitId.description,
    example: propertyMetadata.unitId.example,
    name: propertyMetadata.unitId.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsString()
  unitId: string;
}
