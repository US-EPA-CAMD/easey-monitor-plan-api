import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.vw_formula_master_data_relationships' })
export class FormulaMdRelationshipsView extends BaseEntity {
  @PrimaryColumn({
    name: 'parameter_code',
  })
  parameterCode: string;

  @Column({
    name: 'formula_code',
  })
  formulaCode: string;
}
