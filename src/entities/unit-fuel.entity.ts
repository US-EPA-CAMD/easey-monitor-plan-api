import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.unit_fuel' })
export class UnitFuel extends BaseEntity {
  @PrimaryColumn({ name: 'ctl_id' })
  id: string;

  @Column({ name: 'unit_id' })
  unitId: number;

  @Column({ name: 'fuel_type' })
  fuelCode: string;

  @Column({ name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'indicator_cd' })
  indicatorCode: string;

  @Column({ name: 'act_or_proj_cd' })
  actualOrProjectedCode: string;

  @Column({ name: 'ozone_seas_ind' })
  ozoneSeasonIndicator: number;

  @Column({ name: 'dem_so2' })
  demSO2: string;

  @Column({ name: 'dem_gcv' })
  demGCV: string;

  @Column({ name: 'sulfur_content' })
  sulfurContent: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date;
}