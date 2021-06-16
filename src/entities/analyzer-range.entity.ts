import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.analyzer_range' })
export class AnalyzerRange extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'analyzer_range_id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'component_id',
  })
  componentId: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'analyzer_range_cd',
  })
  analyzerRangeCode: string;

  @Column({ name: 'dual_range_ind' })
  dualRangeIndicator: number;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ name: 'begin_hour' })
  beginHour: number;

  @Column({ name: 'end_hour' })
  endHour: number;
}
