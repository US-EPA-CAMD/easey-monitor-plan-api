import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorQualification } from './monitor-qualification.entity';

@Entity({ name: 'camdecmpswks.monitor_qualification_pct' })
export class PCTQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_pct_id' })
  id: string;

  @Column({ name: 'mon_qual_id' })
  qualificationId: string;

  @Column({ name: 'qual_year' })
  qualificationYear: number;

  @Column({ name: 'yr1_qual_data_type_cd' })
  yr1QualificationDataTypeCode: string;

  @Column({ name: 'yr1_qual_data_year' })
  yr1QualificationDataYear: number;

  @Column({ name: 'yr1_pct_value' })
  yr1PercentageValue: number;

  @Column({ name: 'yr2_qual_data_type_cd' })
  yr2QualificationDataTypeCode: string;

  @Column({ name: 'yr2_qual_data_year' })
  yr2QualificationDataYear: number;

  @Column({ name: 'yr2_pct_value' })
  yr2PercentageValue: number;

  @Column({ name: 'yr3_qual_data_type_cd' })
  yr3QualificationDataTypeCode: string;

  @Column({ name: 'yr3_qual_data_year' })
  yr3QualificationDataYear: number;

  @Column({ name: 'yr3_pct_value' })
  yr3PercentageValue: number;

  @Column({ name: 'avg_pct_value' })
  averagePercentValue: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorQualification,
    mq => mq.pctQualifications,
  )
  @JoinColumn({ name: 'mon_qual_id' })
  qualification: MonitorQualification;
}
