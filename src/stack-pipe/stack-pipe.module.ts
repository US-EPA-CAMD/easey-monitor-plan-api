import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StackPipeRepository } from './stack-pipe.repository';
import { StackPipeService } from './stack-pipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([StackPipeRepository])],
  providers: [StackPipeRepository, StackPipeService],
  exports: [StackPipeService],
})
export class StackPipeModule {}
