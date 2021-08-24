import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.monitor_span' })
export class MonitorSpan extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'span_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({ name: 'mpc_value' })
  mpcValue: number;

  @Column({ name: 'mec_value' })
  mecValue: number;

  @Column({ name: 'mpf_value' })
  mpfValue: number;

  @Column({ name: 'max_low_range' })
  maxLowRange: number;

  @Column({ name: 'span_value' })
  spanValue: number;

  @Column({ name: 'full_scale_range' })
  fullScaleRange: number;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ name: 'end_hour' })
  endHour: number;

  @Column({ name: 'default_high_range' })
  defaultHighRange: number;

  @Column({ name: 'flow_span_value' })
  flowSpanValue: number;

  @Column({ name: 'flow_full_scale_range' })
  flowFullScaleRange: number;

  @Column({
    type: 'varchar',
    length: 7,

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

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userid: string;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @Column({ type: 'varchar', length: 7, name: 'span_uom_cd' })
  spanUnitsOfMeasureCode: string;

  @ManyToOne(
    () => MonitorLocation,
    location => location.spans,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
