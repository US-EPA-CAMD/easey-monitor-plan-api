import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorSystem } from './monitor-system.entity';
import { MonitorLocation } from './monitor-location.entity';
import { AnalyzerRange } from './analyzer-range.entity';

@Entity({ name: 'camdecmps.component' })
export class Component extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'component_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: false,
    name: 'component_identifier',
  })
  componentId: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'component_type_cd',
  })
  componentTypeCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'analytical_principle_cd',
  })
  analyticalPrincipleCode: string;

  @Column({ type: 'varchar', length: 7, name: 'acq_cd' })
  sampleAcquisitionMethodCode: string;

  @Column({ type: 'varchar', length: 7, name: 'basis_cd' })
  basisCode: string;

  @Column({
    type: 'varchar',
    length: 25,
    name: 'manufacturer',
  })
  manufacturer: string;

  @Column({
    type: 'varchar',
    length: 15,
    name: 'model_version',
  })
  modelVersion: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'serial_number',
  })
  serialNumber: string;

  @Column({
    type: 'numeric',
    precision: 1,
    scale: 0,
    name: 'hg_converter_ind',
    transformer: new NumericColumnTransformer(),
  })
  hgConverterIndicator: number;

  @Column({
    type: 'varchar',
    length: 8,
    name: 'userid',
  })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToMany(
    () => MonitorSystem,
    ms => ms.monitoringSystemComponentData,
    { eager: true },
  )
  monitoringSystemData: MonitorSystem[];

  @ManyToOne(
    () => MonitorLocation,
    location => location.componentData,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @OneToMany(
    () => AnalyzerRange,
    ar => ar.component,
  )
  analyzerRangeData: AnalyzerRange[];
}
