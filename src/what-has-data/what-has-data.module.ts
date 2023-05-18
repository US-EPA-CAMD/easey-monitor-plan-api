import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WhatHasDataService } from './what-has-data.service';
import { WhatHasDataController } from './what-has-data.controller';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanRepository])],
  controllers: [WhatHasDataController],
  providers: [WhatHasDataService],
})
export class WhatHasDataModule {}
