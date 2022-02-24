import { IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { ComponentBaseDTO } from './component-base.dto';

export class SystemComponentBaseDTO extends ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginDate.description,
    example: propertyMetadata.systemComponentDTOBeginDate.example,
    name: propertyMetadata.systemComponentDTOBeginDate.fieldLabels.value,
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginHour.description,
    example: propertyMetadata.systemComponentDTOBeginHour.example,
    name: propertyMetadata.systemComponentDTOBeginHour.fieldLabels.value,
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndDate.description,
    example: propertyMetadata.systemComponentDTOEndDate.example,
    name: propertyMetadata.systemComponentDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndHour.description,
    example: propertyMetadata.systemComponentDTOEndHour.example,
    name: propertyMetadata.systemComponentDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
