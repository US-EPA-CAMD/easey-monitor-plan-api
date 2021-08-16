import { BaseEntity, Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';

import { MonitorSystem } from './monitor-system.entity';

@Entity({ name: 'camdecmpswks.component' })
export class Component extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'component_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monLocId: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'component_type_cd',
  })
  componentTypeCode: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'basis_cd' })
  basisCode: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'acq_cd' })
  acquisitionMethodCode: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'component_identifier',
  })
  componentIdentifier: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    name: 'model_version',
  })
  modelVersion: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    name: 'manufacturer',
  })
  manufacturer: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'serial_number',
  })
  serialNumber: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'hg_converter_ind',
  })
  hgConverterInd: number;

  @ManyToMany(
    () => MonitorSystem,
    ms => ms.components,
    { eager: true },
  )
  systems: MonitorSystem[];
}
