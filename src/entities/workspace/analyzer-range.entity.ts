import { IsNotEmpty, ValidateIf } from 'class-validator';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Component } from './component.entity';

@Entity({ name: 'camdecmpswks.analyzer_range' })
export class AnalyzerRange extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'analyzer_range_id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'component_id',
  })
  componentRecordId: string;

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
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @Column({ name: 'begin_hour' })
  beginHour: number;

  @Column({ name: 'end_hour' })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;

  @Column({
    type: 'varchar',
    length: 8,
    name: 'userid',
  })
  userId: string;

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => Component,
    c => c.analyzerRanges,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;
}
