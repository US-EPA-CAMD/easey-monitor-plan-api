import { Module } from '@nestjs/common';

import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { WhatHasDataController } from './what-has-data.controller';
import { WhatHasDataService } from './what-has-data.service';

@Module({
  imports: [MonitorPlanModule],
  controllers: [WhatHasDataController],
  providers: [WhatHasDataService],
})
export class WhatHasDataModule {}
