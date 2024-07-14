import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MonitorPlan } from './monitor-plan.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.emission_evaluation' })
export class EmissionEvaluation extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 45,
    name: 'chk_session_id',
  })
  checkSessionId: string;

  @Column({ type: 'timestamp', name: 'last_updated' })
  lastUpdated: Date;

  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    name: 'mon_plan_id',
    nullable: false,
  })
  monitorPlanId: string;

  @Column({
    type: 'varchar',
    length: 1,
    name: 'needs_eval_flg',
  })
  needsEvalFlag: string;

  @PrimaryColumn({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'rpt_period_id',
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  reportingPeriodId: number;

  @Column({
    type: 'varchar',
    length: 7,
    name: 'submission_availability_cd',
  })
  submissionAvailabilityCode: string;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'submission_id',
    transformer: new NumericColumnTransformer(),
  })
  submissionId: number;

  @Column({
    type: 'varchar',
    length: 1,
    name: 'updated_status_flg',
  })
  updatedStatusFlag: string;

  @ManyToOne(
    () => MonitorPlan,
    plan => plan.emissionEvaluations,
  )
  @JoinColumn({ name: 'mon_plan_id' })
  monitorPlan: MonitorPlan;

  @ManyToOne(
    () => ReportingPeriod,
    period => period.emissionEvaluations,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
