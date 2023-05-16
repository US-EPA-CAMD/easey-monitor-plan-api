import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.used_identifier' })
export class UsedIdentifier extends BaseEntity {
  @PrimaryColumn({ name: 'idkey' })
  id: string;

  @Column({ name: 'mon_loc_id' })
  locationId: string;

  @Column({ name: 'table_cd' })
  tableCode: string;

  @Column({ name: 'identifier' })
  identifier: string;

  @Column({ name: 'type_or_parameter_cd' })
  typeOrParameterCode: string;

  @Column({ name: 'formula_or_basis_cd' })
  formulaOrBasisCode: string;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;
}
