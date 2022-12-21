import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpswks.user_check_out' })
export class UserCheckOut {
  @Column({ type: 'int', name: 'facility_id' })
  facId: number;

  @PrimaryColumn({ type: 'text', name: 'mon_plan_id' })
  monPlanId: string;

  @Column({ type: 'timestamp without time zone', name: 'checked_out_on' })
  checkedOutOn: Date;

  @Column({ type: 'text', nullable: true, name: 'checked_out_by' })
  checkedOutBy: string;

  @Column({ type: 'timestamp without time zone', name: 'last_activity' })
  lastActivity: Date;
}
