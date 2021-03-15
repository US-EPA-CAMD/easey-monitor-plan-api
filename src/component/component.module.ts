import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentRepository } from './component.repository';
import{ComponentMap} from '../maps/component.map';
import {MonitorSystemComponentRepository} from 'src/monitor-system/monitor-system-component.repository'
import { MonitorSystemComponent } from 'src/entities/monitor-system-component.entity';
import{systemComponentMap} from 'src/maps/monitor-system-component.map'
import { MonitorMethodMap } from '../maps/monitor-method.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComponentRepository,MonitorSystemComponentRepository]),
  ],
  controllers: [ComponentController],
  providers: [
    MonitorMethodMap,
    ComponentService, 
    MonitorSystemComponent,
    systemComponentMap,
    ComponentMap
    
  ],
})

export class ComponentModule {}
