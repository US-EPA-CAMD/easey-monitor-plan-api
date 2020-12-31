import { BaseEntity, Entity, Column, PrimaryColumn} from 'typeorm';

@Entity({ name: 'camdecmps.mats_method_data' })
export class MatsMethodData extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mats_method_data_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'mats_method_cd' })
  matsMethodCode: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'mats_method_parameter_cd' })
  matsMethodParameterCode: string;
  
  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ nullable: false, name: 'begin_hour' })
  beginHour: number;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ nullable: true, name: 'end_hour' })
  endHour: number;

  @Column({ type: 'varchar', nullable: true, length: 8, name: 'userid' })
  userId: string;

  @Column({ type: 'date', nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;
}
