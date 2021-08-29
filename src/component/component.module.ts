import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyzerRangeModule } from './../analyzer-range/analyzer-range.module';

import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentRepository } from './component.repository';
import { ComponentMap } from '../maps/component.map';

@Module({
  imports: [
    AnalyzerRangeModule,
    TypeOrmModule.forFeature([ComponentRepository]),
  ],
  controllers: [ComponentController],
  providers: [ComponentService, ComponentMap],
  exports: [TypeOrmModule, ComponentService, ComponentMap],
})
export class ComponentModule {}
