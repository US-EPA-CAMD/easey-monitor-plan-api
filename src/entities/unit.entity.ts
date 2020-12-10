import { BaseEntity, Entity, Column, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'ECPMS.unit' })
@Unique('uq_unit', ['facId', 'unitid'])
export class Unit extends BaseEntity {
  @PrimaryColumn({ name: 'unit_id' })
  unitId: number;

  @Column({ name: 'fac_id' })
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

  @Column({ nullable: true, name: 'boiler_sequence_number' })
  boilerSequenceNumber: number;
}
