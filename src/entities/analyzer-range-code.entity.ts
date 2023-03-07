import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.analyzer_range_code' })
export class AnalyzerRangeCode extends BaseEntity {
  @PrimaryColumn({
    name: 'analyzer_range_cd',
  })
  analyzerRangeCode: string;

  @Column({
    name: 'analyzer_range_cd_description',
  })
  analyzerRangeDescription: string;
}
