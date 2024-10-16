import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
  OneToOne,
  Column,
} from 'typeorm';

import { Unit } from './unit.entity';
import { DuctWaf } from './duct-waf.entity';
import { StackPipe } from './stack-pipe.entity';
import { Component } from './component.entity';
import { MatsMethod } from './mats-method.entity';
import { MonitorPlan } from './monitor-plan.entity';
import { MonitorLoad } from './monitor-load.entity';
import { MonitorSpan } from './monitor-span.entity';
import { MonitorMethod } from './monitor-method.entity';
import { MonitorSystem } from './monitor-system.entity';
import { MonitorFormula } from './monitor-formula.entity';
import { MonitorDefault } from './monitor-default.entity';
import { MonitorAttribute } from './monitor-attribute.entity';
import { MonitorQualification } from './monitor-qualification.entity';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorPlanLocation } from './monitor-plan-location.entity';

@Entity({
  name: 'camdecmpswks.monitor_location',
})
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'stack_pipe_id',
  })
  stackPipeId?: string;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'unit_id',
  })
  unitId?: number;

  @Column({
    name: 'userid',
  })
  userId?: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate?: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate?: Date;

  @OneToOne(
    () => StackPipe,
    stackPipe => stackPipe.location,
    { eager: true },
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipe: StackPipe;

  @OneToOne(
    () => Unit,
    unit => unit.location,
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
    { eager: true },
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

  @OneToMany(
    () => DuctWaf,
    ductWaf => ductWaf.location,
  )
  ductWafs: DuctWaf[];

  @OneToMany(
    () => MonitorDefault,
    defaults => defaults.location,
  )
  defaults: MonitorDefault[];

  @OneToMany(
    () => MonitorAttribute,
    attributes => attributes.location,
  )
  attributes: MonitorAttribute[];

  @OneToMany(
    () => MonitorQualification,
    qualification => qualification.location,
  )
  qualifications: MonitorQualification[];

  @OneToMany(
    () => MonitorPlanLocation,
    mpl => mpl.monitorLocation,
  )
  monitorPlanLocations: MonitorPlanLocation[];
}
