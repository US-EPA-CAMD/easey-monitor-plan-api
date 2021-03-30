import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSystemController } from './monitor-system.controller';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';

import{ComponentMap} from '../maps/component.map';
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import{systemComponentMap} from '../maps/monitor-system-component.map'
import { MonitorSystemComponentRepository } from './monitor-system-component.repository';
import { ComponentRepository } from '../component/component.repository';

import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';


@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorSystemRepository,MonitorSystemComponentRepository,ComponentRepository,SystemFuelFlowRepository]),
  ],
  controllers: [MonitorSystemController],
  providers: [
    MonitorSystemMap,
    MonitorSystemService, 
    SystemFuelFlow,
    MonitorSystemComponent,
    systemComponentMap,
    ComponentMap,
    SystemFuelFlowMap
  ],
})

export class MonitorSystemModule {}
