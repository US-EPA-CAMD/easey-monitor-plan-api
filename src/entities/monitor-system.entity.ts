import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Component } from './component.entity';
import { SystemFuelFlow } from './system-fuel-flow.entity';

@Entity({ name: 'camdecmps.monitor_system' })
export class MonitorSystem extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'sys_type_cd' })
  systemTypeCode: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'system_identifier',
  })
  systemIdentifier: string;

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

  @ManyToMany(
    () => Component,
    c => c.systems,
  )
  @JoinTable({
    name: 'camdecmps.monitor_system_component',
    joinColumn: {
      name: 'mon_sys_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'component_id',
      referencedColumnName: 'id',
    },
  })
  components: Component[];

  @OneToMany(
    () => SystemFuelFlow,
    sff => sff.system,
  )
  fuelFlows: SystemFuelFlow[];
}
