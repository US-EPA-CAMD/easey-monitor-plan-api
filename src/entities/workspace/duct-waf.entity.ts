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
    transformer: new NumericColumnTransformer(),
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
    transformer: new NumericColumnTransformer(),
  })
  wafValue: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_test_runs',
    transformer: new NumericColumnTransformer(),
  })
  numberOfTestRuns: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_traverse_points_waf',
    transformer: new NumericColumnTransformer(),
  })
  numberOfTraversePointsWaf: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_test_ports',
    transformer: new NumericColumnTransformer(),
  })
  numberOfTestPorts: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'num_traverse_points_ref',
    transformer: new NumericColumnTransformer(),
  })
  numberOfTraversePointsRef: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 1,
    name: 'duct_width',
    transformer: new NumericColumnTransformer(),
  })
  ductWidth: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 1,
    name: 'duct_depth',
    transformer: new NumericColumnTransformer(),
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
    transformer: new NumericColumnTransformer(),
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
