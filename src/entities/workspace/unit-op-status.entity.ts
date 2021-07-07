import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Unit } from './unit.entity';

@Entity({ name: 'camd.unit_op_status' })
export class UnitOpStatus extends BaseEntity {
  @PrimaryColumn({ name: 'unit_op_status_id' })
  id: number;

  @Column({ name: 'unit_id' })
  unitId: number;

  @Column({ type: 'varchar', name: 'op_status_cd' })
  opStatusCode: string;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @ManyToOne(
    () => Unit,
    u => u.opStatuses,
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
}
