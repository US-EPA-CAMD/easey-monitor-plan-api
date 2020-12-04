import { BaseEntity, Entity, Column, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'unit' })
@Unique('uq_unit', ['fac_id', 'unitid'])
export class Unit extends BaseEntity {
  @PrimaryColumn({ length: 38, name: 'unit_id' })
  unitId: number;

  @Column({ length: 38, name: 'fac_id' })
  facId: number;

  @Column({ type: 'varchar', length: 6, name: 'unitid' })
  unitid: string;

  @Column({
    type: 'varchar',
    length: 4000,
    nullable: true,
    name: 'unit_description',
  })
  unitDescription: string;

  @Column({ type: 'date', nullable: true, name: 'comm_op_date' })
  commOpDate: Date;

  @Column({ length: 38, nullable: true, name: 'boiler_sequence_number' })
  boilerSequenceNumber: number;
}
