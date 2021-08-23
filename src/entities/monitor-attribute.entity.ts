import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.monitor_location_attribute' })
export class MonitorAttribute extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mon_loc_attrib_id',
  })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'duct_ind',
  })
  ductIndicator: number;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'bypass_ind',
  })
  bypassIndicator: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 0,
    name: 'grd_elevation',
  })
  groundElevation: number;

  @Column({
    type: 'numeric',
    precision: 4,
    scale: 0,
    name: 'stack_height',
  })
  stackHeight: number;

  @Column({ type: 'varchar', length: 7, name: 'material_cd' })
  materialCode: string;

  @Column({ type: 'varchar', length: 7, name: 'shape_cd' })
  shapeCode: string;

  @Column({
    type: 'numeric',
    precision: 4,
    scale: 0,
    name: 'cross_area_flow',
  })
  crossAreaFlow: number;

  @Column({
    type: 'numeric',
    precision: 4,
    scale: 0,
    name: 'cross_area_exit',
  })
  crossAreaStackExit: number;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    location => location.formulas,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
