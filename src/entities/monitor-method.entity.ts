import { BaseEntity, Entity, Column, PrimaryColumn, Unique } from 'node_modules';


@Entity({ name: 'ECPMS.monitor_method_data' })
@Unique('DF__MONITOR_M__ADD_D__7AF13DF7',['addDate'])
export class MonitorMethodData extends BaseEntity {


    @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_method_id' })
    matsMethodId: string;

    @Column({ type: 'varchar', length: 45, name: 'mon_loc_id' })
    monLocId: string;

    @Column({ type: 'varchar', length: 7, name: 'parameter_cd' })
    parameterCode: string;

    @Column({ type: 'varchar', length: 7, name: 'sub_data_cd' })
    subDataCode: string;

    @Column({ type: 'varchar', length: 7, name: 'bypass_approach_cd' })
    bypassApproachCode: string;

    @Column({ type: 'date', nullable: true, name: 'begin_date' })
    beginDate: Date;

    @Column({ type: 'date', nullable: true, name: 'end_date' })
    endDate: Date;

    @Column({ type: 'date', nullable: true, name: 'add_date' })
    addDate: Date;
}
