import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';
import { LEEQualification } from './lee-qualification.entity';
import { LMEQualification } from './lme-qualification.entity';
import { PCTQualification } from './pct-qualification.entity';
import { CPMSQualification } from './cpms-qualification.entity';

@Entity({ name: 'camdecmpswks.monitor_qualification' })
export class MonitorQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_qual_id' })
  id: string;

  @Column({ name: 'mon_loc_id' })
  locationId: string;

  @Column({ name: 'qual_type_cd' })
  qualificationTypeCode: string;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    ml => ml.qualifications,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @OneToMany(
    () => LEEQualification,
    lee => lee.qualification,
  )
  leeQualifications: LEEQualification[];

  @OneToMany(
    () => LMEQualification,
    lme => lme.qualification,
  )
  lmeQualifications: LMEQualification[];

  @OneToMany(
    () => PCTQualification,
    pct => pct.qualification,
  )
  pctQualifications: PCTQualification[];

  @OneToMany(
    () => CPMSQualification,
    cpms => cpms.qualification,
  )
  cpmsQualifications: CPMSQualification[];
}
