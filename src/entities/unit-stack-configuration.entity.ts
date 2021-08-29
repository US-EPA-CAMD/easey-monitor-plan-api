import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.unit_stack_configuration' })
export class UnitStackConfiguration extends BaseEntity {
  @PrimaryColumn({ name: 'config_id' })
  id: string;

  @Column({ name: 'unit_id' })
  unitId: number;

  @Column({ name: 'stack_pipe_id' })
  stackPipeId: string;

  @Column({ name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date;
}
