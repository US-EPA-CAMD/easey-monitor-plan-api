import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn
} from 'typeorm';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_plan_id'
  })
  id: string;

  @ManyToOne(() => Plant, plant => plant.plans)
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @ManyToMany(() => MonitorLocation, location => location.plans, { eager: true })
  @JoinTable({
    name: 'camdecmps.monitor_plan_location',
    joinColumn: {
      name: 'mon_plan_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'mon_loc_id',
      referencedColumnName: 'id'
    }
  })
  locations: MonitorLocation[];
}
