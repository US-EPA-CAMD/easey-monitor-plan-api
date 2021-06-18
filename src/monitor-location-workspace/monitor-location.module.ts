import { Module } from '@nestjs/common';

import { MonitorLocationWorkspaceController } from './monitor-location.controller';

@Module({
  controllers: [MonitorLocationWorkspaceController],
})
export class MonitorLocationWorkspaceModule {}
