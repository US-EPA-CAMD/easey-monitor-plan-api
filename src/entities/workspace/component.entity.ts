import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorSystem } from './monitor-system.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.component' })
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
  })
  hgConverterIndicator: number;

  @Column({
    type: 'varchar',
    length: 8,
    name: 'userid',
  })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToMany(
    () => MonitorSystem,
    ms => ms.components,
    { eager: true },
  )
  systems: MonitorSystem[];

  @ManyToOne(
    () => MonitorLocation,
    location => location.components,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}