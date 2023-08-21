import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';
import { Transform } from 'class-transformer';

export class MonitorPlanParamsDTO extends PaginationDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  @IsOrisCode({
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  facId: number;

  @ApiProperty()
  @ApiProperty({
    description: propertyMetadata.monitorPlanDTOOrisCode.description,
    example: propertyMetadata.monitorPlanDTOOrisCode.example,
    name: propertyMetadata.monitorPlanDTOOrisCode.fieldLabels.value,
  })
  @IsNumber()
  orisCode: number;

  @ApiProperty({
    isArray: true,
    description:
      'The Monintor Plan Summary ID is a unique identifier for a monitor plan record',
  })
  @Transform(({ value }) => value.split('|').map((id: string) => id.trim()))
  monitorPlanIds?: string[];

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  reportedValuesOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  active: boolean;
}
