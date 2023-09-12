import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { Component } from './component.entity';
import { MonitorSystem } from './monitor-system.entity';

@Entity({ name: 'camdecmpswks.monitor_system_component' })
export class SystemComponent extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_comp_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_sys_id' })
  monitoringSystemRecordId: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'component_id',
  })
  componentRecordId: string;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
  })
  beginHour: number;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 0,
    name: 'end_hour',
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({
    type: 'varchar',
    length: 8,
    name: 'userid',
  })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

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
