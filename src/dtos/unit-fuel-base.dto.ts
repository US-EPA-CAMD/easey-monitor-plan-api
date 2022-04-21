import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInt, ValidationArguments } from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class UnitFuelBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitFuelDTOFuelCode.description,
    example: propertyMetadata.unitFuelDTOFuelCode.example,
    name: propertyMetadata.unitFuelDTOFuelCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct fuel_type_cd as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITFUEL-FATAL-B] The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOIndicatorCode.description,
    example: propertyMetadata.unitFuelDTOIndicatorCode.example,
    name: propertyMetadata.unitFuelDTOIndicatorCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct fuel_indicator_cd as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITFUEL-FATAL-B] The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  indicatorCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.description,
    example: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.example,
    name: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITFUEL-FATAL-A] The value for ${args.value}  in the Unit Fuel record ${args.property} must be within the range of 0 and 1`;
    },
  })
  ozoneSeasonIndicator: number;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTODemGCV.description,
    example: propertyMetadata.unitFuelDTODemGCV.example,
    name: propertyMetadata.unitFuelDTODemGCV.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct dem_gcv as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITFUEL-FATAL-B] The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  demGCV: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTODemSO2.description,
    example: propertyMetadata.unitFuelDTODemSO2.example,
    name: propertyMetadata.unitFuelDTODemSO2.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct dem_so2 as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITFUEL-FATAL-B] The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  demSO2: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOBeginDate.description,
    example: propertyMetadata.unitFuelDTOBeginDate.example,
    name: propertyMetadata.unitFuelDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITFUEL-FATAL-A] The value for ${args.value} in the Unit Fuel record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOEndDate.description,
    example: propertyMetadata.unitFuelDTOEndDate.example,
    name: propertyMetadata.unitFuelDTOEndDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITFUEL-FATAL-A] The value for ${args.value} in the Unit Fuel record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  endDate: Date;
}
