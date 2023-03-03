import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.vw_unitcontrol_master_data_relationships' })
export class UnitControlCode extends BaseEntity {
  @PrimaryColumn({
    name: 'controlequipparamcode',
  })
  unitControlCode: string;

  @Column({
    name: 'control_code',
  })
  controlCode: string;
}
