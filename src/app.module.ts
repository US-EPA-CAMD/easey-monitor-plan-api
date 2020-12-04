import { Module } from '@nestjs/common';
import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
   ConfigModule.forRoot({
      isGlobal: true,
    }),
    MonitorPlanModule,
  ],
})
export class AppModule {}
