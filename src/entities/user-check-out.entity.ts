import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpswks.user_check_out' })
export class UserCheckOut {
  @PrimaryColumn({ type: 'int', name: 'facility_id' })
  facId: number;

  @Column({ type: 'text', nullable: true, name: 'mon_plan_id' })
  monPlanId: string;

  @Column({ type: 'date', name: 'checked_out_on' })
  checkedOutOn: Date;

  @Column({ type: 'text', nullable: true, name: 'checked_out_by' })
  checkedOutBy: string;

  @Column({ type: 'date', name: 'expiration' })
  expiration: Date;
}
