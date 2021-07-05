import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemFuelFlowController } from './system-fuel-flow.controller';
import { SystemFuelFlowService } from './system-fuel-flow.service';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';

@Module({
  imports: [TypeOrmModule.forFeature([SystemFuelFlowRepository])],
  controllers: [SystemFuelFlowController],
  providers: [SystemFuelFlowService, SystemFuelFlowMap],
})
export class SystemFuelFlowModule {}
