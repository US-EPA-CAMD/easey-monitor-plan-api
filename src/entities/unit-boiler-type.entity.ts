import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Unit } from './unit.entity';

@Entity({ name: 'camd.unit_boiler_type' })
export class UnitBoilerType extends BaseEntity {
  @PrimaryColumn({
    type: 'numeric',
    precision: 38,
    scale: 0,
    name: 'unit_boiler_type_id',
  })
  id: number;

  @Column({
    type: 'numeric',
    precision: 38,
    scale: 0,
    nullable: false,
    name: 'unit_id',
  })
  unitId: number;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'unit_type_cd',
  })
  unitTypeCode: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  beginDate: Date;

  @Column({
    type: 'date',
    name: 'end_date',
  })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
    name: 'userid',
  })
  userId: string;

  @Column({
    type: 'date',
    name: 'update_date',
  })
  updateDate: Date;

  @ManyToOne(
    () => Unit,
    u => u.unitBoilerType,
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
}
