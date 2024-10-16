import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { MonitorLocation } from './monitor-location.entity';
import { Plant } from './plant.entity';
import { UnitBoilerType } from './unit-boiler-type.entity';
import { UnitCapacity } from './unit-capacity.entity';
import { UnitControl } from './unit-control.entity';
import { UnitFuel } from './unit-fuel.entity';
import { UnitOpStatus } from './unit-op-status.entity';
import { UnitProgram } from './unit-program.entity';
import { UnitStackConfiguration } from './unit-stack-configuration.entity';

@Entity({ name: 'camd.unit' })
export class Unit extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
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
    type: 'date',
    name: 'comr_op_date',
  })
  commercialOperationDate?: Date;

  @Column({
    type: 'date',
    name: 'comm_op_date',
  })
  operationDate: Date;

  @Column({
    name: 'non_load_based_ind',
    transformer: new NumericColumnTransformer(),
  })
  nonLoadBasedIndicator: number;

  @Column({
    name: 'fac_id',
    transformer: new NumericColumnTransformer(),
  })
  facId: number;

  @Column({
    name: 'userid',
    type: 'varchar',
    length: 160,
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'add_date',
    type: 'timestamp',
    nullable: false,
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    type: 'timestamp',
    nullable: true,
  })
  updateDate: Date;

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

  @OneToOne(
    () => UnitBoilerType,
    ubt => ubt.unit,
    { eager: true },
  )
  unitBoilerType: UnitBoilerType;

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
  unitFuels: UnitFuel[];

  @OneToMany(
    () => UnitControl,
    uf => uf.unit,
    { eager: true },
  )
  unitControls: UnitControl[];

  @OneToMany(
    () => UnitCapacity,
    uc => uc.unit,
    { eager: true },
  )
  unitCapacities: UnitCapacity[];

  @OneToMany(
    () => UnitProgram,
    up => up.unit,
  )
  unitPrograms: UnitProgram[];

  @OneToMany(
    () => UnitStackConfiguration,
    ucs => ucs.unit,
    { eager: true },
  )
  unitStackConfigurations: UnitStackConfiguration[];
}
