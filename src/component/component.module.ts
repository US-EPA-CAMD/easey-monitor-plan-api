import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentRepository } from './component.repository';
import { ComponentMap } from '../maps/component.map';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentRepository])],
  controllers: [ComponentController],
  providers: [ComponentService, ComponentMap],
})
export class ComponentModule {}
