import { BaseEntity, Entity, Column, PrimaryColumn, Unique } from 'typeorm';


@Entity({ name: 'camdecmps.monitor_location' })

export class MonitorLocation extends BaseEntity {

    @PrimaryColumn({ type: 'varchar', length: 45,  name: 'mon_loc_id' })
    monLocId: string;

    @Column({ type: 'varchar', length: 45, nullable: true, name: 'stack_pipe_id' })
    stackPipeId: string;

    @Column({nullable: true, name: 'unit_id' })
    unitId: number;

    @Column({ type: 'varchar', length: 8, nullable: true, name: 'userid' })
    userId: string;

    @Column({ type: 'date', nullable: true, name: 'add_date' })
    addDate: Date;

    @Column({ type: 'date', nullable: true, name: 'update_date' })
    updateDate: Date;
}
