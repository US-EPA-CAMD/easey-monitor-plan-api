import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_span' })
export class MonitorSpan extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'span_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({ type: 'numeric', precision: 6, scale: 1, name: 'mpc_value' })
  mpcValue: number;

  @Column({ type: 'numeric', precision: 6, scale: 1, name: 'mec_value' })
  mecValue: number;

  @Column({ type: 'numeric', precision: 10, scale: 0, name: 'mpf_value' })
  mpfValue: number;

  @Column({ type: 'numeric', precision: 6, scale: 1, name: 'max_low_range' })
  maxLowRange: number;

  @Column({ type: 'numeric', precision: 13, scale: 3, name: 'span_value' })
  spanValue: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 3,
    name: 'full_scale_range',
  })
  fullScaleRange: number;

  @Column({ type: 'varchar', length: 7, name: 'span_uom_cd' })
  spanUnitsOfMeasureCode: string;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 0,
    name: 'default_high_range',
  })
  defaultHighRange: number;

  @Column({ type: 'numeric', precision: 10, scale: 0, name: 'flow_span_value' })
  flowSpanValue: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 0,
    name: 'flow_full_scale_range',
  })
  flowFullScaleRange: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'component_type_cd',
  })
  componentTypeCode: string;

  @Column({ type: 'varchar', length: 7, name: 'span_scale_cd' })
  spanScaleCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    name: 'span_method_cd',
  })
  spanMethodCode: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: false,
    name: 'begin_hour',
  })
  beginHour: number;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'numeric', precision: 2, scale: 0, name: 'end_hour' })
  endHour: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    ml => ml.spans,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
