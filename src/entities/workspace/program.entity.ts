import {
  BaseEntity,
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { UnitProgram } from './unit-program.entity';
import { ProgramCode } from './program-code.entity';

@Entity({ name: 'camd.program' })
export class Program extends BaseEntity {
  @PrimaryColumn({
    name: 'prg_id',
    precision: 38,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  programId: number;

  @Column({ name: 'add_date', type: 'timestamp' })
  addDate: Date;

  @Column({
    name: 'fed_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    default: 0,
    transformer: new NumericColumnTransformer(),
  })
  federalIndicator: number;

  @Column({
    name: 'first_sip_year',
    type: 'numeric',
    precision: 4,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  firstSipYear?: number;

  @Column({
    name: 'indian_country_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    default: 0,
    transformer: new NumericColumnTransformer(),
  })
  indianCountryIndicator: number;

  @Column({
    name: 'overdraft_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    default: 0,
    transformer: new NumericColumnTransformer(),
  })
  overdraftIndicator: number;

  @Column({ name: 'prg_cd', type: 'varchar', length: 8 })
  programCode: string;

  @Column({ name: 'state_cd', type: 'varchar', length: 2, nullable: true })
  stateCode?: string;

  @Column({ name: 'state_reg', type: 'varchar', length: 20, nullable: true })
  stateRegulation?: string;

  @Column({
    name: 'trading_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    default: 1,
    transformer: new NumericColumnTransformer(),
  })
  tradingIndicator: number;

  @Column({
    name: 'tribal_land_cd',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  tribalLandCode?: string;

  @Column({ name: 'update_date', type: 'timestamp', nullable: true })
  updateDate?: Date;

  @Column({ name: 'userid', type: 'varchar', length: 160 })
  userId: string;

  @OneToMany(
    () => UnitProgram,
    up => up.program,
    { eager: true },
  )
  unitPrograms: UnitProgram[];

  @ManyToOne(
    () => ProgramCode,
    pc => pc.programs,
  )
  @JoinColumn({ name: 'prg_cd' })
  code: ProgramCode;
}
