import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSpanWorkspaceController } from './monitor-span.controller';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';
import { MonitorSpanMap } from '../maps/monitor-span.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSpanWorkspaceRepository])],
  controllers: [MonitorSpanWorkspaceController],
  providers: [MonitorSpanWorkspaceService, MonitorSpanMap],
  exports: [TypeOrmModule, MonitorSpanWorkspaceService, MonitorSpanMap],
})
export class MonitorSpanWorkspaceModule {}
