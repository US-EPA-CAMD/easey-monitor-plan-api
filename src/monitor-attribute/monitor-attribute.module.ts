import { Module } from '@nestjs/common';
import { MonitorAttributeService } from './monitor-attribute.service';
import { MonitorAttributeController } from './monitor-attribute.controller';

@Module({
  controllers: [MonitorAttributeController],
  providers: [MonitorAttributeService]
})
export class MonitorAttributeModule {}
