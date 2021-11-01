import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorQualification } from './monitor-qualification.entity';

@Entity({ name: 'camdecmpswks.monitor_qualification_lee' })
export class LEEQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_qual_lee_id' })
  id: string;

  @Column({ name: 'mon_qual_id' })
  qualificationId: string;

  @Column({ name: 'qual_test_date' })
  qualificationTestDate: Date;

  @Column({ name: 'parameter_cd' })
  parameterCode: string;

  @Column({ name: 'qual_lee_test_type_cd' })
  qualificationTestType: string;

  @Column({ name: 'potential_annual_emissions' })
  potentialAnnualHgMassEmissions: number;

  @Column({ name: 'applicable_emission_standard' })
  applicableEmissionStandard: number;

  @Column({ name: 'emission_standard_uom' })
  unitsOfStandard: string;

  @Column({ name: 'emission_standard_pct' })
  percentageOfEmissionStandard: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorQualification,
    mq => mq.leeQualifications,
  )
  @JoinColumn({ name: 'mon_qual_id' })
  qualification: MonitorQualification;
}
