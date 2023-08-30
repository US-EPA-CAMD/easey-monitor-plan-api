import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.equation_code' })
export class EquationCode extends BaseEntity {
  @PrimaryColumn({
    name: 'equation_cd',
  })
  equationCode: string;

  @Column({
    name: 'equation_cd_description',
  })
  equationDescription: string;

  @Column({
    name: 'moisture_ind',
  })
  moistureInd: string;
}
