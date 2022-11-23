import { Module } from '@nestjs/common';
import { MonitorConfigurationsService } from './monitor-configurations.service';
import { MonitorConfigurationsController } from './monitor-configurations.controller';
import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanRepository]),
    MonitorPlanModule,
  ],
  controllers: [MonitorConfigurationsController],
  providers: [MonitorConfigurationsService],
})
export class MonitorConfigurationsModule {}
