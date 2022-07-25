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
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';
import { MonitorPlanComment } from './monitor-plan-comment.entity';
import { UnitStackConfiguration } from './unit-stack-configuration.entity';
import { MonitorPlanReportingFrequency } from './monitor-plan-reporting-freq.entity';

@Entity({ name: 'camdecmpswks.monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    name: 'mon_plan_id',
  })
  id: string;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'fac_id',
    transformer: new NumericColumnTransformer(),
  })
  facId: number;

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

  @Column({
    type: 'varchar',
    length: 7,
    name: 'eval_status_cd',
  })
  evalStatusCode: string;

  @Column({
    type: 'varchar',
    length: 25,
    name: 'userid',
  })
  userId: string;

  @Column({ nullable: false, name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date;

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

  @OneToMany(
    () => MonitorPlanComment,
    comment => comment.plan,
  )
  comments: MonitorPlanComment[];

  reportingFrequencies: MonitorPlanReportingFrequency[];

  unitStackConfigurations: UnitStackConfiguration[];
}
