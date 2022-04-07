import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { UnitFuelBaseDTO } from './unit-fuel-base.dto';

export class UnitFuelDTO extends UnitFuelBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitFuelDTOId.description,
    example: propertyMetadata.unitFuelDTOId.example,
    name: propertyMetadata.unitFuelDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOUnitId.description,
    example: propertyMetadata.unitFuelDTOUnitId.example,
    name: propertyMetadata.unitFuelDTOUnitId.fieldLabels.value,
  })
  unitId: number;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOActualOrProjectCode.description,
    example: propertyMetadata.unitFuelDTOActualOrProjectCode.example,
    name: propertyMetadata.unitFuelDTOActualOrProjectCode.fieldLabels.value,
  })
  actualOrProjectCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOSulfurContent.description,
    example: propertyMetadata.unitFuelDTOSulfurContent.example,
    name: propertyMetadata.unitFuelDTOSulfurContent.fieldLabels.value,
  })
  sulfurContent: number;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOUserId.description,
    example: propertyMetadata.unitFuelDTOUserId.example,
    name: propertyMetadata.unitFuelDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOAddDate.description,
    example: propertyMetadata.unitFuelDTOAddDate.example,
    name: propertyMetadata.unitFuelDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOUpdateDate.description,
    example: propertyMetadata.unitFuelDTOUpdateDate.example,
    name: propertyMetadata.unitFuelDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOActive.description,
    example: propertyMetadata.unitFuelDTOActive.example,
    name: propertyMetadata.unitFuelDTOActive.fieldLabels.value,
  })
  active: boolean;
}
