import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdmd.county_code' })
export class CountyCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 8,
    name: 'county_cd',
  })
  countyCode: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: false,
    name: 'county_number',
  })
  countyNumber: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    name: 'county_name',
  })
  countyName: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    name: 'state_cd',
  })
  stateCode: string;
}
