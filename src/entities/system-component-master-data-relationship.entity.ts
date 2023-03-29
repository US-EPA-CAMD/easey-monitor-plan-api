import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.vw_systemcomponent_master_data_relationships' })
export class SystemComponentMasterDataRelationships extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'component_type_code',
  })
  componentTypeCode: string;

  @Column({
    type: 'varchar',
    name: 'sample_aquisition_method_code',
  })
  sampleAcquisitionMethodCode: string;

  @Column({
    type: 'varchar',
    name: 'basis_code',
  })
  basisCode: string;
}
