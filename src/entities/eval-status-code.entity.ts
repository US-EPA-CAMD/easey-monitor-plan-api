import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.eval_status_code' })
export class EvalStatusCode extends BaseEntity {
  @PrimaryColumn({
    name: 'eval_status_cd',
  })
  evalStatusCd: string;

  @Column({
    name: 'eval_status_cd_description',
  })
  evalStatusCodeDescription: string;
}
