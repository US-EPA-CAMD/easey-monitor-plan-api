import { Module } from '@nestjs/common';
import { MonitorDefaultService } from './monitor-default.service';
import { MonitorDefaultController } from './monitor-default.controller';

@Module({
  controllers: [MonitorDefaultController],
  providers: [MonitorDefaultService]
})
export class MonitorDefaultModule {}
