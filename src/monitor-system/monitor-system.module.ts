import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemComponentModule } from '../system-component/system-component.module';
import { SystemFuelFlowModule } from '../system-fuel-flow/system-fuel-flow.module';

import { MonitorSystemController } from './monitor-system.controller';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';

@Module({
  imports: [
    SystemFuelFlowModule,
    SystemComponentModule,
    TypeOrmModule.forFeature([MonitorSystemRepository]),
  ],
  controllers: [MonitorSystemController],
  providers: [MonitorSystemRepository, MonitorSystemService, MonitorSystemMap],
  exports: [
    TypeOrmModule,
    MonitorSystemRepository,
    MonitorSystemService,
    MonitorSystemMap,
  ],
})
export class MonitorSystemModule {}
