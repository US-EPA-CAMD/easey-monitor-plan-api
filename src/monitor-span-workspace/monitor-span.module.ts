import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorSpanWorkspaceController } from './monitor-span.controller';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorSpanChecksService } from './monitor-span-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorSpanWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorSpanWorkspaceController],
  providers: [
    MonitorSpanWorkspaceService,
    MonitorSpanMap,
    MonitorSpanChecksService,
  ],
  exports: [
    TypeOrmModule,
    MonitorSpanWorkspaceService,
    MonitorSpanMap,
    MonitorSpanChecksService,
  ],
})
export class MonitorSpanWorkspaceModule {}
