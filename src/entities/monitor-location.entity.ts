import { BaseEntity, Entity, Column, PrimaryColumn, Unique } from 'node_modules';


@Entity({ name: 'ECPMS.monitor_location' })
@Unique('DF__MONITOR_L__ADD_D__1209AD79',['addDate'])
export class MonitorLocation extends BaseEntity {

    @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_loc_id' })
    monLocId: string;

    @Column({ type: 'varchar', length: 45, name: 'stack_pipe_id' })
    stackPipeId: string;

    @PrimaryColumn({ name: 'unit_id' })
    unitId: number;

    @Column({ type: 'varchar', length: 8, name: 'userid' })
    userId: string;

    @Column({ type: 'date', nullable: true, name: 'add_date' })
    addDate: Date;

    @Column({ type: 'date', nullable: true, name: 'update_date' })
    updateDate: Date;
}
