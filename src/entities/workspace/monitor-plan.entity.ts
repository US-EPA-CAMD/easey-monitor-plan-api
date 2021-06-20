import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_plan_id',
  })
  id: string;

  @Column({
    name: 'fac_id',
  })
  facId: number;

  @ManyToOne(
    () => Plant,
    plant => plant.plans,
  )
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @ManyToMany(
    () => MonitorLocation,
    location => location.plans,
  )
  @JoinTable({
    name: 'camdecmpswks.monitor_plan_location',
    joinColumn: {
      name: 'mon_plan_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'mon_loc_id',
      referencedColumnName: 'id',
    },
  })
  locations: MonitorLocation[];

  @Column({
    name: 'end_rpt_period_id',
  })
  endReportPeriodId: number;
}
