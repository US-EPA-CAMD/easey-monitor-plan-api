import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Program } from './program.entity';

@Entity({ name: 'camdmd.program_code' })
export class ProgramCode extends BaseEntity {
  @PrimaryColumn({ name: 'prg_cd', type: 'varchar', length: 8 })
  programCode: string;

  @Column({
    name: 'allocation_check_year',
    type: 'numeric',
    precision: 4,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  allocationCheckYear?: number;

  @Column({
    name: 'allow_comp_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  allowanceComplianceIndicator: number;

  @Column({
    name: 'allowance_ui_filter',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  allowanceUiFilter: number;

  @Column({
    name: 'bulk_file_active',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  bulkFileActive: number;

  @Column({
    name: 'comp_parameter_cd',
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  complianceParameterCode?: string;

  @Column({
    name: 'compliance_ui_filter',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  complianceUiFilter: number;

  @Column({
    name: 'egu_only_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  electricGeneratingUnitOnlyIndicator: number;

  @Column({
    name: 'emissions_ui_filter',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  emissionsUiFilter: number;

  @Column({
    name: 'fed_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  federalIndicator: number;

  @Column({
    name: 'first_comp_year',
    type: 'numeric',
    precision: 4,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  firstComplianceYear?: number;

  @Column({
    name: 'generator_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  generatorIndicator: number;

  @Column({
    name: 'indian_country_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  indianCountryIndicator: number;

  @Column({ name: 'notes', type: 'varchar', length: 1000 })
  notes: string;

  @Column({
    name: 'nox_cert_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  noxCertificationIndicator: number;

  @Column({
    name: 'noxc_cert_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  noxcCertificationIndicator: number;

  @Column({
    name: 'os_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  ozoneSeasonIndicator: number;

  @Column({
    name: 'penalty_factor',
    type: 'numeric',
    precision: 1,
    scale: 0,
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  penaltyFactor?: number;

  @Column({ name: 'prg_description', type: 'varchar', length: 1000 })
  programDescription: string;

  @Column({ name: 'prg_group_cd', type: 'varchar', length: 8, nullable: true })
  programGroupCode?: string;

  @Column({
    name: 'rep_required_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  repRequiredIndicator: number;

  @Column({
    name: 'rue_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  rueIndicator: number;

  @Column({
    name: 'so2_cert_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  so2CertificationIndicator: number;

  @Column({ name: 'trading_end_date', type: 'date', nullable: true })
  tradingEndDate?: Date;

  @Column({
    name: 'unit_allocation_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    transformer: new NumericColumnTransformer(),
  })
  unitAllocationIndicator: number;

  @OneToMany(
    () => Program,
    p => p.code,
  )
  programs: Program[];
}
