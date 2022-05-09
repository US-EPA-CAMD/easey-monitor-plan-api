import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_location_attribute' })
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
    transformer: new NumericColumnTransformer(),
  })
  ductIndicator: number;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'bypass_ind',
    transformer: new NumericColumnTransformer(),
  })
  bypassIndicator: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 0,
    name: 'grd_elevation',
    transformer: new NumericColumnTransformer(),
  })
  groundElevation: number;

  @Column({
    type: 'numeric',
    precision: 4,
    scale: 0,
    name: 'stack_height',
    transformer: new NumericColumnTransformer(),
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
    transformer: new NumericColumnTransformer(),
  })
  crossAreaFlow: number;

  @Column({
    type: 'numeric',
    precision: 4,
    scale: 0,
    name: 'cross_area_exit',
    transformer: new NumericColumnTransformer(),
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
