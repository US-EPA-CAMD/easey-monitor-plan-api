import { IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class MonitorFormulaBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaId.description,
    example: propertyMetadata.monitorFormulaDTOFormulaId.example,
    name: propertyMetadata.monitorFormulaDTOFormulaId.fieldLabels.value,
  })
  formulaId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOParameterCode.description,
    example: propertyMetadata.monitorFormulaDTOParameterCode.example,
    name: propertyMetadata.monitorFormulaDTOParameterCode.fieldLabels.value,
  })
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaCode.description,
    example: propertyMetadata.monitorFormulaDTOFormulaCode.example,
    name: propertyMetadata.monitorFormulaDTOFormulaCode.fieldLabels.value,
  })
  formulaCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaText.description,
    example: propertyMetadata.monitorFormulaDTOFormulaText.example,
    name: propertyMetadata.monitorFormulaDTOFormulaText.fieldLabels.value,
  })
  formulaText: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOBeginDate.description,
    example: propertyMetadata.monitorFormulaDTOBeginDate.example,
    name: propertyMetadata.monitorFormulaDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOBeginHour.description,
    example: propertyMetadata.monitorFormulaDTOBeginHour.example,
    name: propertyMetadata.monitorFormulaDTOBeginHour.fieldLabels.value,
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOEndDate.description,
    example: propertyMetadata.monitorFormulaDTOEndDate.example,
    name: propertyMetadata.monitorFormulaDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOEndHour.description,
    example: propertyMetadata.monitorFormulaDTOEndHour.example,
    name: propertyMetadata.monitorFormulaDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
