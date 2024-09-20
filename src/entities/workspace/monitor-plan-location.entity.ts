import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';
import { MonitorPlan } from '../monitor-plan.entity';

@Entity({ name: 'camdecmpswks.monitor_plan_location' })
export class MonitorPlanLocation extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    name: 'monitor_plan_location_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mon_plan_id',
  })
  planId: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mon_loc_id',
  })
  locationId: string;

  @JoinColumn({ name: 'mon_plan_id' })
  @ManyToOne(
    () => MonitorPlan,
    mp => mp.id,
  )
  monitorPlan: MonitorPlan;

  @JoinColumn({ name: 'mon_loc_id' })
  @ManyToOne(
    () => MonitorLocation,
    ml => ml.id,
  )
  monitorLocation: MonitorLocation;
}
