import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.system_designation_code' })
export class SystemDesignationCode extends BaseEntity {
  @PrimaryColumn({
    name: 'sys_designation_cd',
  })
  systemDesignationCode: string;

  @Column({
    name: 'sys_designation_cd_description',
  })
  systemDesignationCodeDescription: string;
}
