import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserCheckOutModule } from '../user-check-out/user-check-out.module';
import { CheckOutService } from './check-out.service';
import { CheckOutController } from './check-out.controller';
import { MonitorPlanWorkspaceModule } from 'src/monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [UserCheckOutModule, MonitorPlanWorkspaceModule, HttpModule],
  controllers: [CheckOutController],
  providers: [CheckOutService],
  exports: [CheckOutService],
})
export class CheckOutModule {}
