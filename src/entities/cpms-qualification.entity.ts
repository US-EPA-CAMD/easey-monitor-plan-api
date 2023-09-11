import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorQualification } from './monitor-qualification.entity';

@Entity({ name: 'camdecmps.monitor_qualification_cpms' })
export class CPMSQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_qual_cpms_id' })
  id: string;

  @Column({ name: 'mon_qual_id' })
  qualificationId: string;

  @Column({
    name: 'qual_data_year',
    transformer: new NumericColumnTransformer(),
  })
  qualificationDataYear: number;

  @Column({
    name: 'stack_test_number',
    type: 'varchar',
  })
  stackTestNumber: string;

  @Column({
    name: 'operating_limit',
    transformer: new NumericColumnTransformer(),
  })
  operatingLimit: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorQualification,
    mq => mq.monitoringQualificationCPMSData,
  )
  @JoinColumn({ name: 'mon_qual_id' })
  qualification: MonitorQualification;
}
