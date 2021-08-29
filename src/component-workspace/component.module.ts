import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyzerRangeWorkspaceModule } from './../analyzer-range-workspace/analyzer-range.module';

import { ComponentWorkspaceController } from './component.controller';
import { ComponentWorkspaceService } from './component.service';
import { ComponentWorkspaceRepository } from './component.repository';
import { ComponentMap } from '../maps/component.map';

@Module({
  imports: [
    AnalyzerRangeWorkspaceModule,
    TypeOrmModule.forFeature([ComponentWorkspaceRepository]),
  ],
  controllers: [ComponentWorkspaceController],
  providers: [ComponentWorkspaceService, ComponentMap],
  exports: [TypeOrmModule, ComponentWorkspaceService, ComponentMap],
})
export class ComponentWorkspaceModule {}
