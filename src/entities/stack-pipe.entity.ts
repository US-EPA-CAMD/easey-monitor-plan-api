import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.stack_pipe' })
export class StackPipe extends BaseEntity {
  @PrimaryColumn({
    name: 'stack_pipe_id',
  })
  id: number;

  @Column({
    name: 'stack_name',
  })
  name: string;

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
}
