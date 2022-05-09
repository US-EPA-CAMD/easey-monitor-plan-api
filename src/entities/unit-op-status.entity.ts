import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { Unit } from './unit.entity';

@Entity({ name: 'camd.unit_op_status' })
export class UnitOpStatus extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_op_status_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({ name: 'unit_id', transformer: new NumericColumnTransformer() })
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
