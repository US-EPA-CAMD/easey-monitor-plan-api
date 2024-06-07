import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlowController } from './system-fuel-flow.controller';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowService } from './system-fuel-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemFuelFlowRepository])],
  controllers: [SystemFuelFlowController],
  providers: [
    SystemFuelFlowRepository,
    SystemFuelFlowService,
    SystemFuelFlowMap,
  ],
  exports: [
    TypeOrmModule,
    SystemFuelFlowRepository,
    SystemFuelFlowService,
    SystemFuelFlowMap,
  ],
})
export class SystemFuelFlowModule {}
