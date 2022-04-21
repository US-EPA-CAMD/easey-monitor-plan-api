import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { UnitControlBaseDTO } from './unit-control-base.dto';

export class UnitControlDTO extends UnitControlBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitControlDTOId.description,
    example: propertyMetadata.unitControlDTOId.example,
    name: propertyMetadata.unitControlDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUnitId.description,
    example: propertyMetadata.unitControlDTOUnitId.example,
    name: propertyMetadata.unitControlDTOUnitId.fieldLabels.value,
  })
  unitId: number;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUserId.description,
    example: propertyMetadata.unitControlDTOUserId.example,
    name: propertyMetadata.unitControlDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOAddDate.description,
    example: propertyMetadata.unitControlDTOAddDate.example,
    name: propertyMetadata.unitControlDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUpdateDate.description,
    example: propertyMetadata.unitControlDTOUpdateDate.example,
    name: propertyMetadata.unitControlDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOActive.description,
    example: propertyMetadata.unitControlDTOActive.example,
    name: propertyMetadata.unitControlDTOActive.fieldLabels.value,
  })
  active: boolean;
}
