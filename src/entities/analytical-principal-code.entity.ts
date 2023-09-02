import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.analytical_principle_code' })
export class AnalyticalPrincipalCode extends BaseEntity {
  @PrimaryColumn({
    name: 'analytical_principle_cd',
  })
  analyticalPrincipalCode: string;

  @Column({
    name: 'analytical_principle_cd_description',
  })
  analyticalPrincipalCodeDescription: string;
}
