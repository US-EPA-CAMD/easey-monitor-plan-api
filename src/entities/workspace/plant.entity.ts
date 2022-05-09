import { BaseEntity, Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Unit } from './unit.entity';
import { StackPipe } from './stack-pipe.entity';
import { MonitorPlan } from './monitor-plan.entity';

@Entity({ name: 'camd.plant' })
export class Plant extends BaseEntity {
  @PrimaryColumn({
    name: 'fac_id',
  })
  id: number;

  @Column({
    name: 'oris_code',
    transformer: new NumericColumnTransformer(),
  })
  orisCode: number;

  @Column({
    name: 'facility_name',
  })
  name: string;

  @Column()
  state: string;

  @Column({
    name: 'county_cd',
  })
  countyCode: string;

  @Column({
    name: 'epa_region',
  })
  region: number;

  @OneToMany(
    () => Unit,
    unit => unit.plant,
  )
  units: Unit[];

  @OneToMany(
    () => StackPipe,
    stackPipe => stackPipe.plant,
  )
  stackPipes: StackPipe[];

  @OneToMany(
    () => MonitorPlan,
    plan => plan.plant,
  )
  plans: MonitorPlan[];
}
