import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.reporting_period' })
export class ReportingPeriod extends BaseEntity {
  @PrimaryColumn({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'calendar_year',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  year: number;

  @Column({
    name: 'quarter',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  quarter: number;

  @Column({
    type: 'date',
    name: 'begin_date',
    nullable: false,
  })
  beginDate: Date;

  @Column({
    type: 'date',
    name: 'end_date',
    nullable: false,
  })
  endDate: Date;

  @Column({
    name: 'period_description',
    nullable: false,
  })
  periodDescription: string;

  @Column({
    name: 'period_abbreviation',
    nullable: false,
  })
  periodAbbreviation: string;

  @Column({
    name: 'archive_ind',
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  archiveInd: number;
}
