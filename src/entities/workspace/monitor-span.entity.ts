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
  monLocId: string;

  @Column({ nullable: true, name: 'mpc_value' })
  mpcValue: number;

  @Column({ nullable: true, name: 'mec_value' })
  mecValue: number;

  @Column({ nullable: true, name: 'mpf_value' })
  mpfValue: number;

  @Column({ nullable: true, name: 'max_low_range' })
  maxLowRange: number;

  @Column({ nullable: true, name: 'span_value' })
  spanValue: number;

  @Column({ nullable: true, name: 'full_scale_range' })
  fullScaleRange: number;

  @Column({ type: 'date', nullable: true, name: 'begin_date' })
  beginDate: Date;

  @Column({ nullable: true, name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ nullable: true, name: 'end_hour' })
  endHour: number;

  @Column({ nullable: true, name: 'default_high_range' })
  defaultHighRange: number;

  @Column({ nullable: true, name: 'flow_span_value' })
  flowSpanValue: number;

  @Column({ nullable: true, name: 'flow_full_scale_range' })
  flowFullScaleRange: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'component_type_cd',
  })
  componentTypeCd: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'span_scale_cd' })
  spanScaleCd: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'span_method_cd',
  })
  spanMethodCd: string;

  @Column({ type: 'varchar', length: 8, nullable: true, name: 'userid' })
  userid: string;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'span_uom_cd' })
  spanUomCd: string;

  @ManyToOne(
    () => MonitorLocation,
    location => location.spans,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
