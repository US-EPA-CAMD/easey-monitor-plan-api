import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Component } from './component.entity';
import { SystemComponent } from './system-component.entity';
import { SystemFuelFlow } from './system-fuel-flow.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_system' })
export class MonitorSystem extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'system_identifier',
  })
  monitoringSystemId: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'sys_type_cd' })
  systemTypeCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'sys_designation_cd',
  })
  systemDesignationCode: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'fuel_cd' })
  fuelCode: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ name: 'begin_hour' })
  beginHour: number;

  @Column({ name: 'end_hour' })
  endHour: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToMany(
    () => Component,
    c => c.systems,
  )
  @JoinTable({
    name: 'camdecmpswks.monitor_system_component',
    joinColumn: {
      name: 'mon_sys_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'component_id',
      referencedColumnName: 'id',
    },
  })
  components: SystemComponent[];

  @OneToMany(
    () => SystemFuelFlow,
    sff => sff.system,
  )
  fuelFlows: SystemFuelFlow[];

  @ManyToOne(
    () => MonitorLocation,
    location => location.systems,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
