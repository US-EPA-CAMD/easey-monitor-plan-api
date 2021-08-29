import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorQualification } from './monitor-qualification.entity';

@Entity({ name: 'camdecmpswks.monitor_qualification_lme' })
export class LMEQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_lme_id' })
  id: string;

  @Column({ name: 'mon_qual_id' })
  qualificationId: string;

  @Column({ name: 'qual_data_year' })
  qualificationDataYear: number;

  @Column({ name: 'so2_tons' })
  so2Tons: number;

  @Column({ name: 'nox_tons' })
  noxTons: number;

  @Column({ name: 'op_hours' })
  operatingHours: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorQualification,
    mq => mq.lmeQualifications,
  )
  @JoinColumn({ name: 'mon_qual_id' })
  qualification: MonitorQualification;
}
