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
  locationId: string;

  @Column({ type: 'date', name: 'waf_determined_date' })
  wafDeterminationDate: Date;

  @Column({ type: 'date', nullable: false, name: 'waf_effective_date' })
  wafBeginDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: false,
    name: 'waf_effective_hour',
  })
  wafBeginHour: number;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'waf_method_cd' })
  wafMethodCode: string;

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
    name: 'num_test_runs',
  })
  numberOfTestRuns: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_traverse_points_waf',
  })
  numberOfTraversePointsWaf: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_test_ports',
  })
  numberOfTestPorts: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_traverse_points_ref',
  })
  numberOfTraversePointsRef: number;

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

  @Column({ type: 'date', name: 'end_date' })
  wafEndDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
    name: 'end_hour',
  })
  wafEndHour: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    location => location.ductWafs,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
