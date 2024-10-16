import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorPlan } from './monitor-plan.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.monitor_plan_reporting_freq' })
export class MonitorPlanReportingFrequency extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mon_plan_rf_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mon_plan_id',
  })
  monitorPlanId: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'report_freq_cd',
  })
  reportFrequencyCode: string;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'begin_rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  beginReportPeriodId: number;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'end_rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  endReportPeriodId: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'add_date',
  })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorPlan,
    mp => mp.reportingFrequencies,
  )
  @JoinColumn({ name: 'mon_plan_id' })
  plan: MonitorPlan;

  @ManyToOne(() => ReportingPeriod)
  @JoinColumn({
    name: 'begin_rpt_period_id',
  })
  beginReportingPeriod: ReportingPeriod;

  @ManyToOne(() => ReportingPeriod)
  @JoinColumn({
    name: 'end_rpt_period_id',
  })
  endReportingPeriod: ReportingPeriod;
}
