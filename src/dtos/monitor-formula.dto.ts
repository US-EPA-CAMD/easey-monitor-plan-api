import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorFormulaBaseDTO } from './monitor-formula-base.dto';

export class MonitorFormulaDTO extends MonitorFormulaBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOId.description,
    example: propertyMetadata.monitorFormulaDTOId.example,
    name: propertyMetadata.monitorFormulaDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOLocationId.description,
    example: propertyMetadata.monitorFormulaDTOLocationId.example,
    name: propertyMetadata.monitorFormulaDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOUserId.description,
    example: propertyMetadata.monitorFormulaDTOUserId.example,
    name: propertyMetadata.monitorFormulaDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOAddDate.description,
    example: propertyMetadata.monitorFormulaDTOAddDate.example,
    name: propertyMetadata.monitorFormulaDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOUpdateDate.description,
    example: propertyMetadata.monitorFormulaDTOUpdateDate.example,
    name: propertyMetadata.monitorFormulaDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOActive.description,
    example: propertyMetadata.monitorFormulaDTOActive.example,
    name: propertyMetadata.monitorFormulaDTOActive.fieldLabels.value,
  })
  active: boolean;
}
