import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemFuelFlowWorkspaceController } from './system-fuel-flow.controller';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';

@Module({
  imports: [TypeOrmModule.forFeature([SystemFuelFlowWorkspaceRepository])],
  controllers: [SystemFuelFlowWorkspaceController],
  providers: [SystemFuelFlowWorkspaceService, SystemFuelFlowMap],
  exports: [TypeOrmModule, SystemFuelFlowWorkspaceService, SystemFuelFlowMap],
})
export class SystemFuelFlowWorkspaceModule {}
