import { ApiProperty } from '@nestjs/swagger'
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { UnitCapacityBaseDTO } from './unit-capacity-base.dto';

export class UnitCapacityDTO extends UnitCapacityBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOId.description,
    example: propertyMetadata.unitCapacityDTOId.example,
    name: propertyMetadata.unitCapacityDTOId.fieldLabels.value
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUnitId.description,
    example: propertyMetadata.unitCapacityDTOUnitId.example,
    name: propertyMetadata.unitCapacityDTOUnitId.fieldLabels.value
  })
  unitId: number;

  @ApiProperty({
    description: propertyMetadata.commercialOperationDate.description,
    example: propertyMetadata.commercialOperationDate.example,
    name: propertyMetadata.commercialOperationDate.fieldLabels.value
  })
  commercialOperationDate: Date;

  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value
  })
  operationDate: Date;

  
  boilerTurbineType: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOBeginDate.description,
    example: propertyMetadata.unitCapacityDTOBeginDate.example,
    name: propertyMetadata.unitCapacityDTOBeginDate.fieldLabels.value
  })
  boilerTurbineBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOEndDate.description,
    example: propertyMetadata.unitCapacityDTOEndDate.example,
    name: propertyMetadata.unitCapacityDTOEndDate.fieldLabels.value
  })
  boilerTurbineEndDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUserId.description,
    example: propertyMetadata.unitCapacityDTOUserId.example,
    name: propertyMetadata.unitCapacityDTOUserId.fieldLabels.value
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOAddDate.description,
    example: propertyMetadata.unitCapacityDTOAddDate.example,
    name: propertyMetadata.unitCapacityDTOAddDate.fieldLabels.value
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUpdateDate.description,
    example: propertyMetadata.unitCapacityDTOUpdateDate.example,
    name: propertyMetadata.unitCapacityDTOUpdateDate.fieldLabels.value
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOActive.description,
    example: propertyMetadata.unitCapacityDTOActive.example,
    name: propertyMetadata.unitCapacityDTOActive.fieldLabels.value
  })
  active: boolean;
}
