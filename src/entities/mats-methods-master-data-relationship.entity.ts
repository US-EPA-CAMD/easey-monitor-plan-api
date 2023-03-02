import {
  BaseEntity,
  Entity,
  Column,
} from 'typeorm';

@Entity({ name: 'camdecmpsmd.vw_matsmethods_master_data_relationships' })
export class MatsMethodsMasterDataRelationships extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'parameter_code',
  })
  parameterCode: string;

  @Column({
    type: 'varchar',
    name: 'method_code',
  })
  methodCode: string;
}