import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_plan_id',
    type: 'varchar',
    length: 45,
  })
  id: string;

  @Column({name: 'fac_id'})
  facId: number;
}
