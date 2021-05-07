import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.monitor_formula' })
export class MonitorFormula extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_form_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'parameter_cd' })
  parameterCd: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'equation_cd' })
  equationCd: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'formula_identifier',
  })
  formulaIdentifier: string;

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
  formulaEquation: string;

  @Column({ type: 'varchar', length: 8, nullable: false, name: 'userid' })
  userId: string;

  @Column({ type: 'date', nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;
}
