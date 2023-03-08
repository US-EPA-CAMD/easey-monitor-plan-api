import { BaseEntity, PrimaryColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'camdecmpsmd.vw_span_master_data_relationships' })
export class VwSpanMasterDataRelationships extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'component_type_code',
  })
  componentTypeCode: string;

  @Column({
    type: 'varchar',
    name: 'unit_of_measure_code',
  })
  unitOfMeasureCode: string;

  @Column({
    type: 'varchar',
    name: 'span_scale_code',
  })
  spanScaleCode: string;

  @Column({
    type: 'varchar',
    name: 'span_method_code',
  })
  spanMethodCode: string;
}
