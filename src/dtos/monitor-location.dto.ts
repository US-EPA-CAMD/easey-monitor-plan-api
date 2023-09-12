import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonitorLocationBaseDTO } from './monitor-location-base.dto';
import { MonitorAttributeDTO } from './monitor-attribute.dto';
import { UnitCapacityDTO } from './unit-capacity.dto';
import { UnitControlDTO } from './unit-control.dto';
import { UnitFuelDTO } from './unit-fuel.dto';
import { MonitorMethodDTO } from './monitor-method.dto';
import { MatsMethodDTO } from './mats-method.dto';
import { MonitorFormulaDTO } from './monitor-formula.dto';
import { MonitorDefaultDTO } from './monitor-default.dto';
import { MonitorSpanDTO } from './monitor-span.dto';
import { DuctWafDTO } from './duct-waf.dto';
import { MonitorLoadDTO } from './monitor-load.dto';
import { ComponentDTO } from './component.dto';
import { MonitorSystemDTO } from './monitor-system.dto';
import { MonitorQualificationDTO } from './monitor-qualification.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MonitorLocationDTO extends MonitorLocationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOId.description,
    example: propertyMetadata.monitorLocationDTOId.example,
    name: propertyMetadata.monitorLocationDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOUnitRecordId.description,
    example: propertyMetadata.monitorLocationDTOUnitRecordId.example,
    name: propertyMetadata.monitorLocationDTOUnitRecordId.fieldLabels.value,
  })
  unitRecordId: number;

  @ApiProperty({
    description:
      propertyMetadata.unitStackConfigurationDTOStackPipeId.description,
    example: propertyMetadata.unitStackConfigurationDTOStackPipeId.example,
  })
  stackPipeRecordId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOName.description,
    example: propertyMetadata.monitorLocationDTOName.example,
    name: propertyMetadata.monitorLocationDTOName.fieldLabels.value,
  })
  name: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOType.description,
    example: propertyMetadata.monitorLocationDTOType.example,
    name: propertyMetadata.monitorLocationDTOType.fieldLabels.value,
  })
  type: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOActive.description,
    example: propertyMetadata.monitorLocationDTOActive.example,
    name: propertyMetadata.monitorLocationDTOActive.fieldLabels.value,
  })
  active: boolean;

  @ValidateNested({ each: true })
  @Type(() => MonitorAttributeDTO)
  monitoringLocationAttribData: MonitorAttributeDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitCapacityDTO)
  unitCapacityData: UnitCapacityDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitControlDTO)
  unitControlData: UnitControlDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitFuelDTO)
  unitFuelData: UnitFuelDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorMethodDTO)
  monitoringMethodData: MonitorMethodDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsMethodDTO)
  supplementalMATSMonitoringMethodData: MatsMethodDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorFormulaDTO)
  monitoringFormulaData: MonitorFormulaDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorDefaultDTO)
  monitoringDefaultData: MonitorDefaultDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorSpanDTO)
  monitoringSpanData: MonitorSpanDTO[];

  @ValidateNested({ each: true })
  @Type(() => DuctWafDTO)
  rectangularDuctWAFData: DuctWafDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorLoadDTO)
  monitoringLoadData: MonitorLoadDTO[];

  @ValidateNested({ each: true })
  @Type(() => ComponentDTO)
  componentData: ComponentDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorSystemDTO)
  monitoringSystemData: MonitorSystemDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorQualificationDTO)
  monitoringQualificationData: MonitorQualificationDTO[];
}
