import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';
import { UnitStackConfiguration } from '../unit-stack-configuration.entity';

@Entity({ name: 'camdecmpswks.stack_pipe' })
export class StackPipe extends BaseEntity {
  @PrimaryColumn({
    name: 'stack_pipe_id',
  })
  id: string;

  @Column({
    name: 'stack_name',
  })
  name: string;

  @Column({
    name: 'active_date',
  })
  activeDate: Date;

  @Column({
    name: 'retire_date',
  })
  retireDate: Date;

  @Column({
    name: 'fac_id',
  })
  facId: number;

  @ManyToOne(
    () => Plant,
    plant => plant.stackPipes,
  )
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @OneToMany(
    () => MonitorLocation,
    location => location.stackPipe,
  )
  locations: MonitorLocation[];

  @OneToOne(
    () => UnitStackConfiguration,
    unitStackConfig => unitStackConfig.stackPipe,
  )
  unitStackConfig: UnitStackConfiguration;
}
