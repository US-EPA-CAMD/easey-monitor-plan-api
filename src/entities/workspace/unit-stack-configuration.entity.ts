import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { StackPipe } from './stack-pipe.entity';
import { Unit } from './unit.entity';

@Entity({ name: 'camdecmpswks.unit_stack_configuration' })
export class UnitStackConfiguration extends BaseEntity {
  @PrimaryColumn({ name: 'config_id' })
  id: string;

  @Column({
    type: 'numeric',
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
  })
  unitId: number;

  @Column({ type: 'varchar', name: 'stack_pipe_id' })
  stackPipeId: string;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'varchar', name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => StackPipe,
    stackPipe => stackPipe.unitStackConfigurations,
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipe: StackPipe;

  @ManyToOne(
    () => Unit,
    unit => unit.unitStackConfigurations,
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
}
