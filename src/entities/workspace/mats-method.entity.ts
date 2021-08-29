import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.mats_method_data' })
export class MatsMethod extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mats_method_data_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'mats_method_parameter_cd',
  })
  supplementalMATSMonitoringMethodCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'mats_method_cd',
  })
  supplementalMATSParameterCode: string;

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
    location => location.matsMethods,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
