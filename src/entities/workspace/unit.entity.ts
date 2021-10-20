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
import { UnitOpStatus } from './unit-op-status.entity';
import { MonitorLocation } from './monitor-location.entity';
import { UnitFuel } from './unit-fuel.entity';

@Entity({ name: 'camd.unit' })
export class Unit extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
  })
  id: number;

  @Column({
    name: 'unitid',
  })
  name: string;

  @Column({
    name: 'unit_description',
  })
  description: string;

  @Column({
    name: 'non_load_based_ind',
  })
  nonLoadBasedIndicator: number;

  @Column({
    name: 'fac_id',
  })
  facId: number;

  @ManyToOne(
    () => Plant,
    plant => plant.units,
  )
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @OneToOne(
    () => MonitorLocation,
    location => location.unit,
  )
  location: MonitorLocation;

  @OneToMany(
    () => UnitOpStatus,
    uos => uos.unit,
    { eager: true },
  )
  opStatuses: UnitOpStatus[];

  @OneToMany(
    () => UnitFuel,
    uf => uf.unit,
    { eager: true },
  )
  @JoinColumn({ name: 'unit_id' })
  unitFuels: UnitFuel[];
}
