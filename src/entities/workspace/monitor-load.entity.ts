import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_load' })
export class MonitorLoad extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'load_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, name: 'mon_loc_id' })
  locationId: string;

  @Column({ type: 'date', name: 'load_analysis_date' })
  loadAnalysisDate: Date;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
  })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({
    nullable: true,
    name: 'end_hour',
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({
    nullable: true,
    name: 'max_load_value',
    transformer: new NumericColumnTransformer(),
  })
  maximumLoadValue: number;

  @Column({
    name: 'second_normal_ind',
    transformer: new NumericColumnTransformer(),
  })
  secondNormalIndicator: number;

  @Column({
    name: 'up_op_boundary',
    transformer: new NumericColumnTransformer(),
  })
  upperOperationBoundary: number;

  @Column({
    name: 'low_op_boundary',
    transformer: new NumericColumnTransformer(),
  })
  lowerOperationBoundary: number;

  @Column({
    type: 'varchar',
    length: 7,
    name: 'normal_level_cd',
  })
  normalLevelCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    name: 'second_level_cd',
  })
  secondLevelCode: string;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @Column({
    type: 'varchar',
    length: 8,
    name: 'max_load_uom_cd',
  })
  maximumLoadUnitsOfMeasureCode: string;

  @ManyToOne(
    () => MonitorLocation,
    location => location.loads,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
