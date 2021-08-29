import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorAttributeWorkspaceController } from './monitor-attribute.controller';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorAttributeWorkspaceRepository])],
  controllers: [MonitorAttributeWorkspaceController],
  providers: [MonitorAttributeWorkspaceService, MonitorAttributeMap],
  exports: [
    TypeOrmModule,
    MonitorAttributeWorkspaceService,
    MonitorAttributeMap,
  ],
})
export class MonitorAttributeWorkspaceModule {}
