import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.basis_code' })
export class BasisCode extends BaseEntity {
  @PrimaryColumn({
    name: 'basis_cd',
  })
  basisCode: string;

  @Column({
    name: 'basis_cd_description',
  })
  basisDescription: string;

  @Column({
    name: 'basis_category',
  })
  basisCategory: string;
}
