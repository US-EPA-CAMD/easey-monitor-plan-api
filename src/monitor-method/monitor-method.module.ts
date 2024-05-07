import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodController } from './monitor-method.controller';
import { MonitorMethodRepository } from './monitor-method.repository';
import { MonitorMethodService } from './monitor-method.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorMethodRepository])],
  controllers: [MonitorMethodController],
  providers: [MonitorMethodRepository, MonitorMethodService, MonitorMethodMap],
  exports: [
    TypeOrmModule,
    MonitorMethodRepository,
    MonitorMethodService,
    MonitorMethodMap,
  ],
})
export class MonitorMethodModule {}
