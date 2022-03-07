import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorPlan } from './monitor-plan.entity';

@Entity({ name: 'camdecmpswks.monitor_plan_comment' })
export class MonitorPlanComment extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_plan_comment_id',
  })
  id: string;

  @Column({
    name: 'mon_plan_id',
  })
  monitorPlanId: string;

  @Column({
    name: 'mon_plan_comment',
  })
  monitorPlanComment: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({
    type: 'timestamp without time zone',
    name: 'add_date',
  })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorPlan,
    mp => mp.comments,
  )
  @JoinColumn({ name: 'mon_plan_id' })
  plan: MonitorPlan;
}
