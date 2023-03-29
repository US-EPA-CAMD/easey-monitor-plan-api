import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserCheckOutModule } from '../user-check-out/user-check-out.module';
import { CheckOutController } from './check-out.controller';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [UserCheckOutModule, MonitorPlanWorkspaceModule, HttpModule],
  controllers: [CheckOutController],
  providers: [],
  exports: [],
})
export class CheckOutModule {}
