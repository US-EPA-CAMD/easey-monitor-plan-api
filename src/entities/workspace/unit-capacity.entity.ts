import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.unit_capacity' })
export class UnitCapacity extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'unit_cap_id',
  })
  id: string;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: false,
    name: 'unit_id',
  })
  unitId: number;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'numeric',
    precision: 7,
    scale: 1,
    name: 'max_hi_capacity',
  })
  maximumHourlyHeatInputCapacity: number;

  @Column({ type: 'varchar', nullable: false, length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', nullable: false, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    location => location.unitCapacity,
  )
  @JoinColumn({ name: 'unit_id' })
  location: MonitorLocation;
}
