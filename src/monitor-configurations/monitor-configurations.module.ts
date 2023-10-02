import { Module } from '@nestjs/common';
import { MonitorConfigurationsService } from './monitor-configurations.service';
import { MonitorConfigurationsController } from './monitor-configurations.controller';
import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { UnitStackConfigurationModule } from '../unit-stack-configuration/unit-stack-configuration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanRepository]),
    MonitorPlanModule,
    UnitStackConfigurationModule,
  ],
  controllers: [MonitorConfigurationsController],
  providers: [MonitorConfigurationsService],
})
export class MonitorConfigurationsModule {}
