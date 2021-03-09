import { BaseEntity, Entity, Column, PrimaryColumn} from 'typeorm';

@Entity({ name: 'camdecmps.monitor_system' })
export class MonitorSystem extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'system_identifier' })
  systemType: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'sys_designation_cd' })
  systemDesignationCode: string;
  
  @Column({ type: 'varchar', length: 7, nullable: false, name: 'fuel_cd' })
  fuelCode: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;
 
}
