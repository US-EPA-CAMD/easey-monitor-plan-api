import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSystemController } from './monitor-system.controller';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';

import{ComponentMap} from '../maps/component.map';
import { MonitorSystemComponent } from 'src/entities/monitor-system-component.entity';
import{systemComponentMap} from 'src/maps/monitor-system-component.map'
import { MonitorSystemComponentRepository } from './monitor-system-component.repository';
import { ComponentRepository } from 'src/component/component.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorSystemRepository,MonitorSystemComponentRepository,ComponentRepository]),
  ],
  controllers: [MonitorSystemController],
  providers: [
    MonitorSystemMap,
    MonitorSystemService, 
    MonitorSystemComponent,
    systemComponentMap,
    ComponentMap
  ],
})

export class MonitorSystemModule {}
