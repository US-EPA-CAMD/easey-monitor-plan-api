import {
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class MonitorFormulaBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaId.description,
    example: propertyMetadata.monitorFormulaDTOFormulaId.example,
    name: propertyMetadata.monitorFormulaDTOFormulaId.fieldLabels.value,
  })
  @MatchesRegEx('[A-Z0-9-]{1,3}', {
    message: (args: ValidationArguments) => {
      return `${args.property} [MONLOC-FATAL-A] The value : ${args.value} for ${args.property} must be match the RegEx: [A-Z0-9-]{1,3}`;
    },
  })
  formulaId: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOParameterCode.description,
    example: propertyMetadata.monitorFormulaDTOParameterCode.example,
    name: propertyMetadata.monitorFormulaDTOParameterCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct parameter_code as "value" FROM camdecmpsmd.vw_formula_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaCode.description,
    example: propertyMetadata.monitorFormulaDTOFormulaCode.example,
    name: propertyMetadata.monitorFormulaDTOFormulaCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct formula_code as "value" FROM camdecmpsmd.vw_formula_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  formulaCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOFormulaText.description,
    example: propertyMetadata.monitorFormulaDTOFormulaText.example,
    name: propertyMetadata.monitorFormulaDTOFormulaText.fieldLabels.value,
  })
  @MaxLength(200, {
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLANCOMMENT-FATAL-A] The value : ${args.value} for ${args.property} must not exceed 4000 characters`;
    },
  })
  formulaText: string;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOBeginDate.description,
    example: propertyMetadata.monitorFormulaDTOBeginDate.example,
    name: propertyMetadata.monitorFormulaDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLANCOMMENT-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOBeginHour.description,
    example: propertyMetadata.monitorFormulaDTOBeginHour.example,
    name: propertyMetadata.monitorFormulaDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [DEFAULT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOEndDate.description,
    example: propertyMetadata.monitorFormulaDTOEndDate.example,
    name: propertyMetadata.monitorFormulaDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [MONPLANCOMMENT-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorFormulaDTOEndHour.description,
    example: propertyMetadata.monitorFormulaDTOEndHour.example,
    name: propertyMetadata.monitorFormulaDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [DEFAULT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
