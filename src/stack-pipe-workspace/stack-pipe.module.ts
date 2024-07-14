import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StackPipeWorkspaceRepository } from './stack-pipe.repository';
import { StackPipeWorkspaceService } from './stack-pipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([StackPipeWorkspaceRepository])],
  providers: [StackPipeWorkspaceRepository, StackPipeWorkspaceService],
  exports: [
    TypeOrmModule,
    StackPipeWorkspaceRepository,
    StackPipeWorkspaceService,
  ],
})
export class StackPipeWorkspaceModule {}
