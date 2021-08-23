import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_formula' })
export class MonitorFormula extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_form_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'parameter_cd' })
  parameterCode: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'equation_cd' })
  equationCode: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'formula_identifier',
  })
  formulaId: string;

  @Column({ type: 'date', nullable: true, name: 'begin_date' })
  beginDate: Date;

  @Column({ nullable: true, name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ nullable: true, name: 'end_hour' })
  endHour: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    name: 'formula_equation',
  })
  formulaText: string;

  @Column({ type: 'varchar', length: 8, nullable: false, name: 'userid' })
  userId: string;

  @Column({ type: 'date', nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    location => location.formulas,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}
