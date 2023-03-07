import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.used_identifier' })
export class UsedIdentifier extends BaseEntity {
  @PrimaryColumn({ name: 'idkey' })
  id: string;

  @Column({ name: 'mon_loc_id', transformer: new NumericColumnTransformer() })
  locationId: number;

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

  @Column({ type: 'date', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'date', name: 'update_date' })
  updateDate: Date;
}
