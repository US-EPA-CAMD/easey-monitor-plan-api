import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.rect_duct_waf' })
export class DuctWaf extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'rect_duct_waf_data_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'date', name: 'waf_determined_date' })
  wafDeterminedDate: Date;

  @Column({ type: 'date', nullable: false, name: 'waf_effective_date' })
  wafEffectiveDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: false,
    name: 'waf_effective_hour',
  })
  wafEffectiveHour: number;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'waf_method_cd' })
  wafMethodCd: string;

  @Column({
    type: 'numeric',
    precision: 6,
    scale: 4,
    nullable: false,
    name: 'waf_value',
  })
  wafValue: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
    name: 'num_test_runs',
  })
  numTestRuns: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_traverse_points_ref',
  })
  numTraversePointsRef: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 1,
    name: 'duct_width',
  })
  ductWidth: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 1,
    name: 'duct_depth',
  })
  ductDepth: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
    name: 'end_hour',
  })
  endHour: number;

  @Column({ type: 'date', nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;

  @Column({ type: 'varchar', nullable: true, length: 8, name: 'userid' })
  userId: string;

  @ManyToOne(
    () => MonitorLocation,
    location => location.ductWafs,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
