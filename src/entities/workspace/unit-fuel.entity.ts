import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { Unit } from './unit.entity';

@Entity({ name: 'camdecmpswks.unit_fuel' })
export class UnitFuel extends BaseEntity {
  @PrimaryColumn({ name: 'uf_id' })
  id: string;

  @Column({ name: 'unit_id', transformer: new NumericColumnTransformer() })
  unitId: number;

  @Column({ name: 'fuel_type' })
  fuelCode: string;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ name: 'indicator_cd' })
  indicatorCode: string;

  @Column({ name: 'act_or_proj_cd' })
  actualOrProjectedCode: string;

  @Column({
    nullable: true,
    name: 'ozone_seas_ind',
    transformer: new NumericColumnTransformer(),
  })
  ozoneSeasonIndicator: number;

  @Column({ name: 'dem_so2' })
  demSO2: string;

  @Column({ name: 'dem_gcv' })
  demGCV: string;

  @Column({
    name: 'sulfur_content',
    transformer: new NumericColumnTransformer(),
  })
  sulfurContent: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ type: 'timestamp', name: 'add_date' })
  addDate: Date;

  @Column({ type: 'timestamp', name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => Unit,
    u => u.unitFuelData,
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
}
