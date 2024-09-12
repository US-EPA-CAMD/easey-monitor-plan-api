import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camd.unit_program' })
export class UnitProgram extends BaseEntity {
  @PrimaryColumn({
    name: 'up_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
  })
  unitId: number;

  @Column({
    name: 'prg_id',
    transformer: new NumericColumnTransformer(),
  })
  programId: number;

  @Column({
    name: 'prg_cd',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  programCode: string;

  @Column({
    name: 'class_cd',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  classCode: string;

  @Column({
    name: 'unit_monitor_cert_begin_date',
    type: 'date',
    nullable: true,
  })
  unitMonitorCertBeginDate: Date;

  @Column({
    name: 'unit_monitor_cert_deadline',
    type: 'date',
    nullable: true,
  })
  unitMonitorCertDeadline: Date;

  @Column({
    name: 'emissions_recording_begin_date',
    type: 'date',
    nullable: true,
  })
  emissionsRecordingBeginDate: Date;

  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate: Date;

  @Column({
    name: 'userid',
    type: 'varchar',
    length: 160,
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'add_date',
    type: 'timestamp',
    nullable: false,
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    type: 'timestamp',
    nullable: true,
  })
  updateDate: Date;
}
