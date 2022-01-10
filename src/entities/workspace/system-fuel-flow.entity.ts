import { IsNotEmpty, ValidateIf } from 'class-validator';
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
  monitoringSystemRecordId: string;

  @Column({
    type: 'numeric',
    precision: 9,
    scale: 1,
    nullable: false,
    name: 'max_rate',
  })
  maximumFuelFlowRate: number;

  @Column({
    type: 'varchar',
    length: 7,
    name: 'max_rate_source_cd',
  })
  maximumFuelFlowRateSourceCode: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'sys_fuel_uom_cd',
  })
  systemFuelFlowUOMCode: string;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'numeric', precision: 2, scale: 0, name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', name: 'end_date' })
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @Column({ type: 'numeric', precision: 2, scale: 0, name: 'end_hour' })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorSystem,
    ms => ms.fuelFlows,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;
}
