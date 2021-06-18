import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorMethodController } from './monitor-method.controller';
import { MonitorMethodService } from './monitor-method.service';
import { MonitorMethodRepository } from './monitor-method.repository';

import { MonitorMethodMap } from '../maps/monitor-method.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorMethodRepository])],
  controllers: [MonitorMethodController],
  providers: [MonitorMethodMap, MonitorMethodService],
})
export class MonitorMethodModule {}
