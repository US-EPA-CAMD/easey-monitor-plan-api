import { BaseEntity, PrimaryColumn, Column, Entity } from "typeorm";

@Entity({ name: 'camdecmpsmd.vw_span_master_data_relationships'})
export class VwSpanMasterDataRelationships extends BaseEntity {
    @PrimaryColumn({})
    componentTypeCode: string

    @Column({})
    unitOfMeasureCode: string

    @Column({})
    spanScaleCode: string

    @Column({})
    spanMethodCode: string
}