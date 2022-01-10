import { IsNotEmpty, ValidateIf } from 'class-validator';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_load' })
export class MonitorLoad extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'load_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({ type: 'date', nullable: true, name: 'load_analysis_date' })
  loadAnalysisDate: Date;

  @Column({ type: 'date', nullable: true, name: 'begin_date' })
  beginDate: Date;

  @Column({ nullable: true, name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @Column({ nullable: true, name: 'end_hour' })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;

  @Column({ nullable: true, name: 'max_load_value' })
  maximumLoadValue: number;

  @Column({ nullable: true, name: 'second_normal_ind' })
  secondNormalIndicator: number;

  @Column({ nullable: true, name: 'up_op_boundary' })
  upperOperationBoundary: number;

  @Column({ nullable: true, name: 'low_op_boundary' })
  lowerOperationBoundary: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'normal_level_cd',
  })
  normalLevelCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'second_level_cd',
  })
  secondLevelCode: string;

  @Column({ type: 'varchar', length: 8, nullable: false, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
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
