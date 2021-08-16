import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorSystem } from './monitor-system.entity';

@Entity({ name: 'camdecmpswks.system_fuel_flow' })
export class SystemFuelFlow extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'sys_fuel_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_sys_id' })
  monSysId: string;

  @Column({ name: 'max_rate' })
  maxRate: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'max_rate_source_cd',
  })
  maxRateSourceCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'sys_fuel_uom_cd',
  })
  sysFuelUomCode: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ name: 'begin_hour' })
  beginHour: number;

  @Column({ name: 'end_hour' })
  endHour: number;

  @ManyToOne(
    () => MonitorSystem,
    ms => ms.fuelFlows,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;
}
