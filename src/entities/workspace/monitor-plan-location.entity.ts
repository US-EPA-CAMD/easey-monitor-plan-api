import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpswks.monitor_plan_location' })
export class MonitorPlanLocation extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 45,
    name: 'monitor_plan_location_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mon_plan_id',
  })
  planId: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'mon_loc_id',
  })
  locationId: string;
}
