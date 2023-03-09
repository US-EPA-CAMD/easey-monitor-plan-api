import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsNumber, IsString } from 'class-validator';

interface MPReportResults {
  unitStackInformation: string;
  severityCode: string;
  categoryCodeDescription: string;
  checkCode: string;
  resultMessage: string;
}

export class MPEvaluationReportDTO {
  @ApiProperty({
    description: propertyMetadata.facilityName.description,
    example: propertyMetadata.facilityName.example,
    name: propertyMetadata.facilityName.fieldLabels.value,
  })
  @IsString()
  facilityName: string;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  @IsNumber()
  facilityId: number;

  @ApiProperty({
    description: propertyMetadata.state.description,
    example: propertyMetadata.state.example,
    name: propertyMetadata.state.fieldLabels.value,
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: propertyMetadata.county.description,
    example: propertyMetadata.county.example,
    name: propertyMetadata.county.fieldLabels.value,
  })
  @IsString()
  countyName: string;

  mpReportResults: MPReportResults[];
}
