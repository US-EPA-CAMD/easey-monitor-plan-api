import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Unit } from './unit.entity';
import { Program } from './program.entity';

@Entity({ name: 'camd.unit_program' })
export class UnitProgram extends BaseEntity {
  @PrimaryColumn({
    name: 'up_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'add_date',
    type: 'timestamp',
    nullable: false,
  })
  addDate: Date;

  @Column({ name: 'app_status_cd', type: 'varchar', length: 7, nullable: true })
  appStatusCode?: string;

  @Column({ name: 'class_cd', type: 'varchar', length: 7, nullable: true })
  classCode?: string;

  @Column({ name: 'def_end_date', type: 'date', nullable: true })
  defaultEndDate?: Date;

  @Column({
    name: 'def_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  defaultIndicator: number;

  @Column({
    name: 'emissions_recording_begin_date',
    type: 'date',
    nullable: true,
  })
  emissionsRecordingBeginDate?: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({
    name: 'non_egu_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  nonElectricGeneratingUnitIndicator: number;

  @Column({
    name: 'nonstandard_cd',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  nonStandardCode?: string;

  @Column({
    name: 'nonstandard_comment',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  nonStandardComment?: string;

  @Column({
    name: 'optin_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  optInIndicator: number;

  @Column({
    name: 'prg_id',
    type: 'numeric',
    precision: 38,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  programId: number;

  @Column({ name: 'prg_cd', type: 'varchar', length: 7, nullable: true })
  programCode?: string;

  @Column({
    name: 'trueup_begin_year',
    type: 'numeric',
    precision: 4,
    scale: 0,
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  trueUpBeginYear?: number;

  @Column({
    name: 'unit_id',
    type: 'numeric',
    precision: 38,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  unitId: number;

  @Column({
    name: 'unit_monitor_cert_begin_date',
    type: 'date',
    nullable: true,
  })
  unitMonitorCertBeginDate?: Date;

  @Column({ name: 'unit_monitor_cert_deadline', type: 'date', nullable: true })
  unitMonitorCertDeadline?: Date;

  @Column({ name: 'up_comment', type: 'varchar', length: 1000, nullable: true })
  unitProgramComment?: string;

  @Column({ name: 'update_date', type: 'timestamp', nullable: true })
  updateDate?: Date;

  @Column({ name: 'userid', type: 'varchar', length: 160 })
  userId: string;

  @ManyToOne(
    () => Unit,
    unit => unit.unitPrograms,
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @ManyToOne(
    () => Program,
    program => program.unitPrograms,
  )
  @JoinColumn({ name: 'prg_id' })
  program: Program;
}
