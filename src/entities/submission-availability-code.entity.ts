import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.submission_availability_code' })
export class SubmissionAvailabilityCode extends BaseEntity {
  @PrimaryColumn({
    name: 'submission_availability_cd',
  })
  subAvailabilityCode: string;

  @Column({
    name: 'sub_avail_cd_description',
  })
  subAvailabilityCodeDescription: string;
}
