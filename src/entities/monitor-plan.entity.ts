import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_plan_id' })
  monPlanId: string;

  @Column({ name: 'fac_id' })
  facId: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'config_type_cd',
  })
  configTypeCd: string;

  @Column({ nullable: true, name: 'submission_id' })
  submissionId: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'submission_availability_cd',
  })
  submissionAvailabilityCd: string;

  @Column({ name: 'begin_rpt_period_id' })
  beginRptPeriodId: number;

  @Column({ nullable: true, name: 'end_rpt_period_id' })
  endRptPeriodId: number;
}
