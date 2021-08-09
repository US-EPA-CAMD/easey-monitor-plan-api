import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

import { Unit } from './unit.entity';
import { Component } from './component.entity';
import { StackPipe } from './stack-pipe.entity';
import { MatsMethod } from './mats-method.entity';
import { MonitorPlan } from './monitor-plan.entity';
import { MonitorLoad } from './monitor-load.entity';
import { MonitorSpan } from './monitor-span.entity';
import { MonitorMethod } from './monitor-method.entity';
import { MonitorSystem } from './monitor-system.entity';
import { MonitorFormula } from './monitor-formula.entity';

@Entity({
  name: 'camdecmpswks.monitor_location',
})
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @ManyToOne(
    () => StackPipe,
    stackPipe => stackPipe.locations,
    { eager: true },
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipe: StackPipe;

  @ManyToOne(
    () => Unit,
    unit => unit.locations,
    { eager: true },
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @ManyToMany(
    () => MonitorPlan,
    plan => plan.locations,
    { eager: true },
  )
  plans: MonitorPlan[];

  @OneToMany(
    () => Component,
    component => component.location,
  )
  components: Component[];

  @OneToMany(
    () => MonitorMethod,
    method => method.location,
  )
  methods: MonitorMethod[];

  @OneToMany(
    () => MatsMethod,
    matsMethod => matsMethod.location,
  )
  matsMethods: MatsMethod[];

  @OneToMany(
    () => MonitorFormula,
    formula => formula.location,
  )
  formulas: MonitorFormula[];

  @OneToMany(
    () => MonitorLoad,
    load => load.location,
  )
  loads: MonitorLoad[];

  @OneToMany(
    () => MonitorSpan,
    span => span.location,
  )
  spans: MonitorSpan[];

  @OneToMany(
    () => MonitorSystem,
    system => system.location,
  )
  systems: MonitorSystem[];
}
