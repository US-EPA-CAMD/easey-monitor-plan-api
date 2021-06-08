import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.monitor_load' })
export class MonitorLoad extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'load_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'date', nullable: true, name: 'load_analysis_date' })
  loadAnalysisDate: Date;

  @Column({ type: 'date', nullable: true, name: 'begin_date' })
  beginDate: Date;

  @Column({ nullable: true, name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ nullable: true, name: 'end_hour' })
  endHour: number;

  @Column({ nullable: true, name: 'max_load_value' })
  maxLoadValue: number;

  @Column({ nullable: true, name: 'second_normal_ind' })
  secondNormalInd: number;

  @Column({ nullable: true, name: 'up_op_boundary' })
  upOpBoundary: number;

  @Column({ nullable: true, name: 'low_op_boundary' })
  lowOpBoundary: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'normal_level_cd',
  })
  normalLevelCd: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'second_level_cd',
  })
  secondLevelCd: string;

  @Column({ type: 'varchar', length: 8, nullable: false, name: 'userid' })
  userId: string;

  @Column({ type: 'date', nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
    name: 'max_load_uom_cd',
  })
  maxLoadUomCd: string;
}
