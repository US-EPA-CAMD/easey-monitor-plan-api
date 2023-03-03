import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.vw_systemfuel_master_data_relationships' })
export class SystemFuelMasterDataRelationship extends BaseEntity {
    @PrimaryColumn({
        type: 'varchar',
        name: 'max_rate_source_code',
    })
    maxRateSourceCode: string;

    @Column({
        type: 'varchar',
        name: 'unit_of_measure_code',
    })
    unitOfMeasureCode: string;
}