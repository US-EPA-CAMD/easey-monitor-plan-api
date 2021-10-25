import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { SystemFuelFlowWorkspaceController } from './system-fuel-flow.controller';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemFuelFlowWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [SystemFuelFlowWorkspaceController],
  providers: [SystemFuelFlowWorkspaceService, SystemFuelFlowMap],
  exports: [TypeOrmModule, SystemFuelFlowWorkspaceService, SystemFuelFlowMap],
})
export class SystemFuelFlowWorkspaceModule {}
