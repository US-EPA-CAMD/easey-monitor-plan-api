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

@Entity({ name: 'camdecmpswks.monitor_qualification_lme' })
export class LMEQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_lme_id' })
  id: string;

  @Column({ name: 'mon_qual_id' })
  qualificationId: string;

  @Column({
    name: 'qual_data_year',
    transformer: new NumericColumnTransformer(),
  })
  qualificationDataYear: number;

  @Column({ name: 'so2_tons', transformer: new NumericColumnTransformer() })
  so2Tons: number;

  @Column({ name: 'nox_tons', transformer: new NumericColumnTransformer() })
  noxTons: number;

  @Column({ name: 'op_hours', transformer: new NumericColumnTransformer() })
  operatingHours: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorQualification,
    mq => mq.monitoringQualificationLMEData,
  )
  @JoinColumn({ name: 'mon_qual_id' })
  qualification: MonitorQualification;
}
