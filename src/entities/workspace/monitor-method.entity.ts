import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_method' })
export class MonitorMethod extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_method_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'parameter_cd' })
  parameterCode: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'sub_data_cd' })
  subDataCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'bypass_approach_cd',
  })
  bypassApproachCode: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'method_cd' })
  methodCode: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ nullable: false, name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ nullable: true, name: 'end_hour' })
  endHour: number;

  @Column({ type: 'varchar', nullable: true, length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    location => location.methods,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
