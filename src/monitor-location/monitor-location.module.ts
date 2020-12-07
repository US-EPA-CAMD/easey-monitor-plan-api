import { Module } from '@nestjs/common';
import { MonitorLocationController } from './monitor-location.controller';
import { MonitorLocationService } from './monitor-location.service';

@Module({
  controllers: [MonitorLocationController],
  providers: [MonitorLocationService]
})
export class MonitorLocationModule {}
