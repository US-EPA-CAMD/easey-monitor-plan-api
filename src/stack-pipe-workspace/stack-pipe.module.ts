import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StackPipeMap } from '../maps/stack-pipe.map';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { StackPipeWorkspaceController } from './stack-pipe.controller';
import { StackPipeWorkspaceRepository } from './stack-pipe.repository';
import { StackPipeWorkspaceService } from './stack-pipe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StackPipeWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorLocationWorkspaceModule),
  ],
  controllers: [StackPipeWorkspaceController],
  providers: [
    StackPipeMap,
    StackPipeWorkspaceRepository,
    StackPipeWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    StackPipeMap,
    StackPipeWorkspaceRepository,
    StackPipeWorkspaceService,
  ],
})
export class StackPipeWorkspaceModule {}
