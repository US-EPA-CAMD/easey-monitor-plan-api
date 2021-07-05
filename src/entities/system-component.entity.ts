import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Component } from './component.entity';
import { MonitorSystem } from './monitor-system.entity';

@Entity({ name: 'camdecmps.monitor_system_component' })
export class SystemComponent extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_comp_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_sys_id' })
  monSysId: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'component_id',
  })
  componentId: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ name: 'begin_hour' })
  beginHour: number;

  @Column({ name: 'end_hour' })
  endHour: number;

  @ManyToOne(
    () => Component,
    c => c.systems,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => MonitorSystem,
    ms => ms.components,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;
}
