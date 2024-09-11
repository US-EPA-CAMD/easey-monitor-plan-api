import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmpswks.unit' })
export class Unit extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'non_load_based_ind',
    transformer: new NumericColumnTransformer(),
  })
  nonLoadBasedIndicator: number;

  @Column({
    name: 'userid',
    type: 'varchar',
    length: 160,
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'add_date',
    type: 'timestamp',
    nullable: false,
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    type: 'timestamp',
    nullable: true,
  })
  updateDate: Date;
}
