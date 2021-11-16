import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';
import { MonitorPlanComment } from './monitor-plan-comment.entity';

@Entity({ name: 'camdecmps.monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_plan_id',
  })
  id: string;

  @Column({
    name: 'fac_id',
  })
  facId: number;

  @Column({
    name: 'end_rpt_period_id',
  })
  endReportPeriodId: number;

  // pointing to needs_eval_flg because there is no eval_status_cd column in global view
  @Column({
    name: 'needs_eval_flg',
  })
  evalStatusCode: string;

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
    name: 'camdecmps.monitor_plan_location',
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

  @OneToMany(
    () => MonitorPlanComment,
    comment => comment.plan,
  )
  comments: MonitorPlanComment[];
}
