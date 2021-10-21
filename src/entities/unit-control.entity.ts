import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Unit } from './unit.entity';

@Entity({ name: 'camdecmps.unit_control' })
export class UnitControl extends BaseEntity {
  @PrimaryColumn({ name: 'ctl_id' })
  id: string;

  @Column({ name: 'unit_id' })
  unitId: number;

  @Column({ name: 'control_cd' })
  controlCode: string;

  @Column({ name: 'ce_param' })
  parameterCode: string;

  @Column({ name: 'install_date' })
  installDate: Date;

  @Column({ name: 'opt_date' })
  optimizationDate: Date;

  @Column({ name: 'orig_cd' })
  originalCode: string;

  @Column({ name: 'retire_date' })
  retireDate: Date;

  @Column({ name: 'seas_cd' })
  seasonalControlsIndicator: string;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => Unit,
    u => u.unitControls,
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
}
