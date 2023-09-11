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

@Entity({ name: 'camdecmps.monitor_qualification_lee' })
export class LEEQualification extends BaseEntity {
  @PrimaryColumn({ name: 'mon_qual_lee_id' })
  id: string;

  @Column({ name: 'mon_qual_id' })
  qualificationId: string;

  @Column({ type: 'date', name: 'qual_test_date' })
  qualificationTestDate: Date;

  @Column({ name: 'parameter_cd' })
  parameterCode: string;

  @Column({ name: 'qual_lee_test_type_cd' })
  qualificationTestType: string;

  @Column({
    name: 'potential_annual_emissions',
    transformer: new NumericColumnTransformer(),
  })
  potentialAnnualMassEmissions: number;

  @Column({
    name: 'applicable_emission_standard',
    transformer: new NumericColumnTransformer(),
  })
  applicableEmissionStandard: number;

  @Column({ name: 'emission_standard_uom' })
  unitsOfStandard: string;

  @Column({
    name: 'emission_standard_pct',
    transformer: new NumericColumnTransformer(),
  })
  percentageOfEmissionStandard: number;

  @Column({ type: 'varchar', length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorQualification,
    mq => mq.monitoringQualificationLEEData,
  )
  @JoinColumn({ name: 'mon_qual_id' })
  qualification: MonitorQualification;
}
