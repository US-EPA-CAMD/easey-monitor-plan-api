import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm';

import { Unit } from './unit.entity';
import { StackPipe } from './stack-pipe.entity';
import { MonitorPlan } from './monitor-plan.entity';

@Entity({
  name: 'camdecmps.monitor_location'
})
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @ManyToOne(() => StackPipe, stackPipe => stackPipe.locations, { eager: true })
  @JoinColumn({ name: 'stack_pipe_id'})
  stackPipe: StackPipe;

  @ManyToOne(() => Unit, unit => unit.locations, { eager: true })
  @JoinColumn({ name: 'unit_id'})
  unit: Unit;

  @ManyToMany(() => MonitorPlan, plan => plan.locations, { eager: true })
  plans: MonitorPlan[];
}