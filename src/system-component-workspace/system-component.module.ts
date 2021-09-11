import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemComponentWorkspaceController } from './system-component.controller';
import { SystemComponentWorkspaceService } from './system-component.service';
import { SystemComponentWorkspaceRepository } from './system-component.repository';
import { SystemComponentMap } from '../maps/system-component.map';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';

@Module({
  imports: [
    ComponentWorkspaceModule,
    TypeOrmModule.forFeature([SystemComponentWorkspaceRepository]),
  ],
  controllers: [SystemComponentWorkspaceController],
  providers: [SystemComponentWorkspaceService, SystemComponentMap],
  exports: [TypeOrmModule, SystemComponentWorkspaceService, SystemComponentMap],
})
export class SystemComponentWorkspaceModule {}
