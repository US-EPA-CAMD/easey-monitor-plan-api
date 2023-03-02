import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.vw_unitcontrol_master_data_relationships' })
export class unitControlCodes extends BaseEntity {
  @Column({
    name: 'controlequipparamcode',
  })
  unitControlCode: string;

  @PrimaryColumn({
    name: 'control_code',
  })
  controlCode: string;
}
