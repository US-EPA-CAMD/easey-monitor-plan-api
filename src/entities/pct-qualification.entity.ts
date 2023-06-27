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

@Entity({ name: 'camdecmps.monitor_qualification_pct' })
export class PCTQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_pct_id' })
  id: string;

  @Column({ name: 'mon_qual_id' })
  qualificationId: string;

  @Column({ name: 'qual_year', transformer: new NumericColumnTransformer() })
  qualificationYear: number;

  @Column({ name: 'yr1_qual_data_type_cd' })
  yr1QualificationDataTypeCode: string;

  @Column({
    name: 'yr1_qual_data_year',
    transformer: new NumericColumnTransformer(),
  })
  yr1QualificationDataYear: number;

  @Column({
    name: 'yr1_pct_value',
    transformer: new NumericColumnTransformer(),
  })
  yr1PercentageValue: number;

  @Column({ name: 'yr2_qual_data_type_cd' })
  yr2QualificationDataTypeCode: string;

  @Column({
    name: 'yr2_qual_data_year',
    transformer: new NumericColumnTransformer(),
  })
  yr2QualificationDataYear: number;

  @Column({
    name: 'yr2_pct_value',
    transformer: new NumericColumnTransformer(),
  })
  yr2PercentageValue: number;

  @Column({ name: 'yr3_qual_data_type_cd' })
  yr3QualificationDataTypeCode: string;

  @Column({
    name: 'yr3_qual_data_year',
    transformer: new NumericColumnTransformer(),
  })
  yr3QualificationDataYear: number;

  @Column({
    name: 'yr3_pct_value',
    transformer: new NumericColumnTransformer(),
  })
  yr3PercentageValue: number;

  @Column({
    name: 'avg_pct_value',
    transformer: new NumericColumnTransformer(),
  })
  averagePercentValue: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorQualification,
    mq => mq.pctQualifications,
  )
  @JoinColumn({ name: 'mon_qual_id' })
  qualification: MonitorQualification;
}
