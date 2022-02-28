import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class ComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
    example: propertyMetadata.componentDTOComponentId.example,
    name: propertyMetadata.componentDTOComponentId.fieldLabels.value,
  })
  componentId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentTypeCode.description,
    example: propertyMetadata.componentDTOComponentTypeCode.example,
    name: propertyMetadata.componentDTOComponentTypeCode.fieldLabels.value,
  })
  componentTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.componentDTOSampleAcquisitionMethodCode.description,
    example: propertyMetadata.componentDTOSampleAcquisitionMethodCode.example,
    name:
      propertyMetadata.componentDTOSampleAcquisitionMethodCode.fieldLabels
        .value,
  })
  sampleAcquisitionMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOBasisCode.description,
    example: propertyMetadata.componentDTOBasisCode.example,
    name: propertyMetadata.componentDTOBasisCode.fieldLabels.value,
  })
  basisCode: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOManufacturer.description,
    example: propertyMetadata.componentDTOManufacturer.example,
    name: propertyMetadata.componentDTOManufacturer.fieldLabels.value,
  })
  manufacturer: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOModelVersion.description,
    example: propertyMetadata.componentDTOModelVersion.example,
    name: propertyMetadata.componentDTOModelVersion.fieldLabels.value,
  })
  modelVersion: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOSerialNumber.description,
    example: propertyMetadata.componentDTOSerialNumber.example,
    name: propertyMetadata.componentDTOSerialNumber.fieldLabels.value,
  })
  serialNumber: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOHgConverterIndicator.description,
    example: propertyMetadata.componentDTOHgConverterIndicator.example,
    name: propertyMetadata.componentDTOHgConverterIndicator.fieldLabels.value,
  })
  hgConverterIndicator: number;
}
