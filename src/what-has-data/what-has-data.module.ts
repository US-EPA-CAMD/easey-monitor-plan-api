import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { WhatHasDataController } from './what-has-data.controller';
import { WhatHasDataService } from './what-has-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanRepository])],
  controllers: [WhatHasDataController],
  providers: [MonitorPlanRepository, WhatHasDataService],
})
export class WhatHasDataModule {}
