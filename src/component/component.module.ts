import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentMap } from '../maps/component.map';
import { AnalyzerRangeModule } from './../analyzer-range/analyzer-range.module';
import { ComponentController } from './component.controller';
import { ComponentRepository } from './component.repository';
import { ComponentService } from './component.service';

@Module({
  imports: [
    AnalyzerRangeModule,
    TypeOrmModule.forFeature([ComponentRepository]),
  ],
  controllers: [ComponentController],
  providers: [ComponentRepository, ComponentService, ComponentMap],
  exports: [TypeOrmModule, ComponentRepository, ComponentService, ComponentMap],
})
export class ComponentModule {}
