import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  OneToMany,
  ManyToOne,
  JoinTable,
  JoinColumn
} from 'typeorm';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.unit' })
export class Unit extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id'
  })
  id: number;

  @Column({
    name: 'unitid'
  })
  name: string;

  @Column({
    name: 'fac_id'
  })
  facId: number;

  @ManyToOne(() => Plant, plant => plant.units)
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @OneToMany(() => MonitorLocation, location => location.unit)
  locations: MonitorLocation[];
}
