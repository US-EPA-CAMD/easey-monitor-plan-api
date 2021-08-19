import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.monitor_default' })
export class MonitorDefault extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mondef_id',
  })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'parameter_cd' })
  parameterCode: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    nullable: false,
    name: 'default_value',
  })
  defaultValue: number;

  @Column({ type: 'varchar', length: 7, name: 'default_uom_cd' })
  defaultUnitsOfMeasureCode: string;

  @Column({ type: 'varchar', length: 7, name: 'default_purpose_cd' })
  defaultPurposeCode: string;

  @Column({ type: 'varchar', length: 7, name: 'fuel_cd' })
  fuelCode: string;

  @Column({ type: 'varchar', length: 7, name: 'operating_condition_cd' })
  operatingConditionCode: string;

  @Column({ type: 'varchar', length: 7, name: 'default_source_cd' })
  defaultSourceCode: string;

  @Column({ type: 'varchar', length: 10, name: 'group_id' })
  groupId: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: false,
    name: 'begin_hour',
  })
  beginHour: number;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'numeric', precision: 2, scale: 0, name: 'end_hour' })
  endHour: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    location => location.formulas,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
