import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSystemController } from './monitor-system.controller';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSystemRepository])],
  controllers: [MonitorSystemController],
  providers: [MonitorSystemService, MonitorSystemMap],
})
export class MonitorSystemModule {}
