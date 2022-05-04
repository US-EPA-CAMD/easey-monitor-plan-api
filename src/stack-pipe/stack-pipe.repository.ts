import { StackPipe } from 'src/entities/workspace/stack-pipe.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(StackPipe)
export class StackPipeRepository extends Repository<StackPipe> {}
