import { BaseEntity, Entity, Column, PrimaryColumn} from 'typeorm';

@Entity({ name: 'camdecmps.monitor_system_component' })
export class MonitorSystemComponent extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_comp_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_sys_id' })
  monSysId: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'component_id' })
  componentId: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({name: 'begin_hour' })
  beginHour: number;

  @Column({name: 'end_hour' })
  endHour: number;
 
}
