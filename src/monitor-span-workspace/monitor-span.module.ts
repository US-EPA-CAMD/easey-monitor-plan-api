import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorSpanChecksService } from './monitor-span-checks.service';
import { MonitorSpanWorkspaceController } from './monitor-span.controller';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';
import { MonitorSpanWorkspaceService } from './monitor-span.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorSpanWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorSpanWorkspaceController],
  providers: [
    MonitorSpanWorkspaceRepository,
    MonitorSpanWorkspaceService,
    MonitorSpanMap,
    MonitorSpanChecksService,
  ],
  exports: [
    TypeOrmModule,
    MonitorSpanWorkspaceRepository,
    MonitorSpanWorkspaceService,
    MonitorSpanMap,
    MonitorSpanChecksService,
  ],
})
export class MonitorSpanWorkspaceModule {}
